import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import { locations } from "@/lib/data";
import { useActiveLocation } from "@/context/location-context";

export function LocationPicker() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { activeLocation, setActiveLocation } = useActiveLocation();
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const handleSelect = (id: string | null) => {
    setActiveLocation(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="group flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:border-accent"
      >
        <div className="flex min-w-0 items-center gap-3">
          {activeLocation ? (
            <>
              <img
                src={activeLocation.image}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {activeLocation.city}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {activeLocation.pharmacy}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary">
                <MapPin className="size-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Standort wählen</p>
                <p className="text-xs text-muted-foreground">Partnerapotheke auswählen</p>
              </div>
            </>
          )}
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Stadt oder PLZ suchen"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Standort suchen"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-secondary"
              aria-label="Schließen"
            >
              <X className="size-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>
          <div className="max-h-[420px] overflow-auto p-2" role="listbox">
            {results.map((l) => {
              const active = activeLocation?.id === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(active ? null : l.id)}
                  className={`group flex w-full items-center gap-4 rounded-md p-2 text-left transition-colors ${active ? "bg-accent-soft" : "hover:bg-secondary"}`}
                >
                  <img
                    src={l.image}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{l.city}</span>
                      {active && (
                        <Check className="size-3.5 text-accent" strokeWidth={2} />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{l.pharmacy}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.street} · {l.zip}
                    </p>
                  </div>
                </button>
              );
            })}
            {results.length === 0 && (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                Kein Standort gefunden. Weitere Partnerapotheken folgen.
              </p>
            )}
          </div>
        </div>
      )}

      {activeLocation && !open && (
        <p className="mt-3 text-sm text-muted-foreground">
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
