import { Link } from "@tanstack/react-router";
import { Home, MapPin, Sparkles, LayoutGrid, User } from "lucide-react";
import { useActiveLocation } from "@/context/location-context";

const tabs = [
  { to: "/", label: "Start", icon: Home, exact: true },
  { to: "/standorte", label: "Standort", icon: MapPin, exact: false },
  { to: "/news", label: "Drops", icon: Sparkles, exact: false },
  { to: "/sortiment", label: "Sortiment", icon: LayoutGrid, exact: false },
  { to: "/konto", label: "Konto", icon: User, exact: false },
] as const;

export function BottomTabBar() {
  const { activeLocation } = useActiveLocation();

  return (
    <nav
      aria-label="App-Navigation"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <Link
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              activeProps={{
                className: "text-foreground",
                "aria-current": "page",
              }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="group flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent active:bg-secondary"
            >
              <span className="relative">
                <tab.icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                {tab.to === "/standorte" && activeLocation && (
                  <span
                    className="absolute -right-1 -top-0.5 size-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="text-[0.625rem] leading-none tracking-tight">
                {tab.label}
              </span>
              <span className="h-px w-6 bg-transparent group-data-[status=active]:bg-accent" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}