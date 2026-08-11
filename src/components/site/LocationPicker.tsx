import { useMemo, useState } from "react";
import { Check, MapPin, Search } from "lucide-react";
import { locations } from "@/lib/data";
import { useActiveLocation } from "@/context/location-context";

export function LocationPicker() {
  const [query, setQuery] = useState("");
  const { activeLocation, setActiveLocation } = useActiveLocation();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        l.city.toLowerCase().includes(q) ||
        l.zip.startsWith(q) ||
        l.pharmacy.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="flex max-w-md items-center gap-3 border-b border-foreground/25 pb-3">
        <Search className="size-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="PLZ oder Stadt eingeben"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          aria-label="Standort suchen"
        />
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2 lg:grid-cols-3">
        {results.map((l) => {
          const active = activeLocation?.id === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActiveLocation(active ? null : l.id)}
              className={`group flex flex-col items-start p-7 text-left transition-colors duration-300 ${
                active ? "bg-accent text-accent-foreground" : "bg-background hover:bg-secondary"
              }`}
            >
              <div className="flex w-full items-start justify-between gap-4">
                <span className="text-xl tracking-tight">{l.city}</span>
                {active ? (
                  <Check className="size-4 shrink-0" strokeWidth={1.5} />
                ) : (
                  <MapPin
                    className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <span
                className={`mt-3 text-sm ${active ? "opacity-90" : "text-muted-foreground"}`}
              >
                {l.pharmacy}
              </span>
              <span
                className={`mt-1 text-sm ${active ? "opacity-75" : "text-muted-foreground"}`}
              >
                {l.street} · {l.zip} {l.city}
              </span>
              <span
                className={`mt-4 text-xs ${active ? "opacity-75" : "text-muted-foreground"}`}
              >
                {l.hours}
              </span>
            </button>
          );
        })}
        {results.length === 0 && (
          <p className="bg-background p-7 text-sm text-muted-foreground">
            Kein Standort gefunden. Weitere Partnerapotheken folgen.
          </p>
        )}
      </div>

      {activeLocation && (
        <p className="mt-6 text-sm text-muted-foreground">
          Aktiver Standort:{" "}
          <span className="text-foreground">
            {activeLocation.pharmacy}, {activeLocation.city}
          </span>{" "}
          — Verfügbarkeiten werden für diesen Standort angezeigt.
        </p>
      )}
    </div>
  );
}