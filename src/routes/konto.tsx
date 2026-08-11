import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileUp,
  LogIn,
  Package,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Bell,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useActiveLocation } from "@/context/location-context";
import { safeStorage } from "@/lib/native";

export const Route = createFileRoute("/konto")({
  head: () => ({
    meta: [
      { title: "Konto — Grastheke App" },
      {
        name: "description",
        content:
          "Ihr Grastheke-Konto: Anmeldung, Bestellhistorie, Rezept-Upload und rechtliche Hinweise der Partnerapotheken.",
      },
      { property: "og:title", content: "Konto — Grastheke App" },
      {
        property: "og:description",
        content: "Anmeldung, Bestellhistorie und Rezept-Upload in der Grastheke App.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KontoPage,
});

const dummyOrders = [
  {
    id: "GT-2024-0912",
    date: "12.09.2024",
    items: "Nachtflor 22 · 10 g",
    status: "Abgeholt",
  },
  {
    id: "GT-2024-0841",
    date: "28.08.2024",
    items: "Klarfeld 18 · 5 g",
    status: "Abgeholt",
  },
  {
    id: "GT-2024-0790",
    date: "05.08.2024",
    items: "Weißharz 26 · 10 g",
    status: "Storniert",
  },
];

const NOTIFY_KEY = "grastheke.notify-orders";

function KontoPage() {
  const { activeLocation } = useActiveLocation();
  const [notify, setNotify] = useState(() => safeStorage.get(NOTIFY_KEY) === "true");

  const toggleNotify = () => {
    const next = !notify;
    setNotify(next);
    safeStorage.set(NOTIFY_KEY, String(next));
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-44">
      <Breadcrumbs items={[{ label: "Startseite", to: "/" }, { label: "Konto" }]} />
      <p className="text-eyebrow mt-6">Konto</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight md:text-6xl">
        Ihr Bereich
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Anmeldung, Rezepte und Bestellungen an einem Ort. Alle Inhalte auf dieser Seite
        sind Platzhalter.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <LogIn className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-medium tracking-tight">Nicht angemeldet</h2>
              <p className="truncate text-sm text-muted-foreground">
                Für Rezepte und Bestellhistorie anmelden
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-full bg-foreground px-6 text-sm text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Anmelden
            </Link>
            <Link
              to="/auth"
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-full border border-border px-6 text-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Konto erstellen
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <MapPin
                className="size-5 text-muted-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-medium tracking-tight">Aktiver Standort</h2>
              <p className="truncate text-sm text-muted-foreground">
                {activeLocation
                  ? `${activeLocation.pharmacy}, ${activeLocation.city}`
                  : "Noch kein Standort gewählt"}
              </p>
            </div>
          </div>
          <Link
            to="/standorte"
            className="mt-6 inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-border px-6 text-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {activeLocation ? "Standort ändern" : "Standort wählen"}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <FileUp className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-medium tracking-tight">Rezept einreichen</h2>
              <p className="text-sm text-muted-foreground">
                E-Rezept-Code oder Foto des Papierrezepts
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-full border border-dashed border-border px-6 text-sm text-muted-foreground sm:w-auto"
          >
            Upload folgt in Kürze
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Bell
                  className="size-5 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-medium tracking-tight">
                  Bestellhinweise
                </h2>
                <p className="text-sm text-muted-foreground">
                  Status-Updates Ihrer Apotheke
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notify}
              aria-label="Bestellhinweise aktivieren"
              onClick={toggleNotify}
              className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                notify ? "border-accent bg-accent" : "border-border bg-secondary"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-background transition-transform ${
                  notify ? "translate-x-[1.55rem]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <Package
            className="size-5 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="text-base font-medium tracking-tight">Bestellhistorie</h2>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {dummyOrders.map((order) => (
            <li
              key={order.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{order.items}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.id} · {order.date}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                {order.status}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Beispieldaten – echte Bestellungen erscheinen nach der Anmeldung.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-2">
        <ul>
          {["Impressum", "Datenschutz", "AGB", "Widerruf"].map((label) => (
            <li key={label}>
              <Link
                to="/kontakt"
                className="flex min-h-[3rem] items-center justify-between rounded-xl px-4 text-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              >
                {label}
                <ChevronRight
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        Abgabe ausschließlich auf ärztliche Verordnung und ab 18 Jahren. Kein Verkauf und
        keine Zahlung in dieser App.
      </p>
    </section>
  );
}