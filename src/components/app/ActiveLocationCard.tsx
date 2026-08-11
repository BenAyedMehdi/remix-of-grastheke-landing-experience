import { Link } from "@tanstack/react-router";
import { MapPin, ChevronRight } from "lucide-react";
import { useActiveLocation } from "@/context/location-context";

export function ActiveLocationCard() {
  const { activeLocation } = useActiveLocation();

  return (
    <Link
      to="/standorte"
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-secondary"
    >
      {activeLocation ? (
        <img
          src={activeLocation.image}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
          <MapPin className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-eyebrow">
          {activeLocation ? "Aktiver Standort" : "Kein Standort gewählt"}
        </p>
        <p className="mt-1 truncate text-base font-medium tracking-tight">
          {activeLocation ? activeLocation.city : "Partnerapotheke wählen"}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {activeLocation
            ? `${activeLocation.pharmacy} · ${activeLocation.hours}`
            : "Bestimmt Verfügbarkeiten und Lieferzeiten"}
        </p>
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}