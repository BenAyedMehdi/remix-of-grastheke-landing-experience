import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  params?: Record<string, string> | undefined;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const defaultLabels: Record<string, string> = {
  "/": "Startseite",
  "/apothekenkooperation": "Apothekenkooperation",
  "/sortiment/": "Sortiment",
  "/sortiment/$slug": "Produktdetail",
  "/chargen/": "Chargensuche",
  "/chargen/$batchNumber": "Chargendetail",
  "/news": "News & Drops",
  "/standorte": "Standorte",
  "/ueber-uns": "Über uns",
  "/kontakt": "Kontakt",
  "/the-gram": "the gram",
};

function useAutoBreadcrumbs(): BreadcrumbItem[] {
  const matches = useMatches();
  console.log("[Breadcrumbs] routeIds:", matches.map((m) => String(m.routeId)).join(", "));
  const items: BreadcrumbItem[] = [];

  for (const match of matches) {
    const routeId = match.routeId as string;
    if (routeId === "__root__") continue;

    const label = defaultLabels[routeId];
    if (!label) continue;

    const params = match.params as Record<string, string> | undefined;

    if (routeId === "/") {
      items.push({ label, to: "/" });
      continue;
    }

    if (routeId === "/sortiment/$slug" && params?.["slug"]) {
      items.push({ label, to: "/sortiment/$slug", params: { slug: params["slug"] } });
      continue;
    }

    if (routeId === "/chargen/$batchNumber" && params?.["batchNumber"]) {
      items.push({
        label: `Charge ${params["batchNumber"]}`,
        to: "/chargen/$batchNumber",
        params: { batchNumber: params["batchNumber"] },
      });
      continue;
    }

    items.push({ label, to: match.pathname });
  }

  return items;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const autoItems = useAutoBreadcrumbs();
  const resolved = items ?? autoItems;

  if (resolved.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-6 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {resolved.map((item, index) => {
          const isLast = index === resolved.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-muted-foreground/40"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
              {isLast || !item.to ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {isFirst && <Home className="inline size-3.5 align-[-0.125em]" strokeWidth={1.5} />}
                  <span className={isFirst ? "sr-only" : ""}>{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.to}
                  {...(item.params ? { params: item.params } : {})}
                  className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
                >
                  {isFirst ? (
                    <>
                      <Home className="inline size-3.5 align-[-0.125em]" strokeWidth={1.5} />
                      <span className="sr-only">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
