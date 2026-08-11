import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  products,
  wirkprofile,
  kollektionen,
  type Product,
  type WirkprofilId,
  type KollektionId,
} from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/sortiment/$slug"
      params={{ slug: product.slug }}
      className="group flex h-full flex-col"
    >
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={`${product.name} – ${product.genetics} Blüte (Platzhalterbild)`}
          loading="lazy"
          width={1024}
          height={1280}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-background/85 px-4 py-3 text-xs opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {product.short} · {product.irradiation}
        </div>
      </div>
      <div className="mt-4 flex min-h-[5.5rem] items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="break-words tracking-tight">{product.name}</p>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {product.genetics} · {product.profile}
          </p>
        </div>
        <p className="w-[6.5rem] max-w-[45%] shrink-0 text-right text-sm leading-relaxed text-muted-foreground">
          THC {product.thc}
          <br />
          CBD {product.cbd}
        </p>
      </div>
      <div className="mt-auto border-t border-border pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span aria-hidden className="tracking-[0.2em] text-foreground">
            {"★".repeat(product.sampleReview.rating)}
            <span className="text-muted-foreground">
              {"★".repeat(5 - product.sampleReview.rating)}
            </span>
          </span>
          <span className="truncate">
            {product.sampleReview.author} · Charge {product.sampleReview.batch}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {product.sampleReview.text}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid() {
  const [wirkung, setWirkung] = useState<WirkprofilId[]>([]);
  const [kollektion, setKollektion] = useState<KollektionId | null>(null);
  const [open, setOpen] = useState(false);

  const byWirkung = (p: Product) =>
    wirkung.length === 0 || wirkung.some((w) => p.wirkprofil.includes(w));
  const byKollektion = (p: Product) => !kollektion || p.kollektion === kollektion;

  const { list, relaxed } = useMemo(() => {
    const exact = products.filter((p) => byWirkung(p) && byKollektion(p));
    if (exact.length > 0) return { list: exact, relaxed: false };
    const fallback =
      wirkung.length > 0 ? products.filter(byWirkung) : products.filter(byKollektion);
    return { list: fallback.length > 0 ? fallback : products, relaxed: true };
  }, [wirkung, kollektion]);

  const toggleWirkung = (id: WirkprofilId) =>
    setWirkung((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));

  const activeTags = [
    ...wirkung.map((id) => ({
      key: `w-${id}`,
      label: wirkprofile.find((w) => w.id === id)!.label,
      remove: () => toggleWirkung(id),
    })),
    ...(kollektion
      ? [
          {
            key: `k-${kollektion}`,
            label: kollektionen.find((k) => k.id === kollektion)!.label,
            remove: () => setKollektion(null),
          },
        ]
      : []),
  ];

  const panel = (
    <div className="space-y-8">
      <div>
        <p className="text-eyebrow">Wirkprofil</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {wirkprofile.map((w) => {
            const active = wirkung.includes(w.id);
            return (
              <button
                key={w.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleWirkung(w.id)}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-eyebrow">Kollektion</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kollektionen.map((k) => {
            const active = kollektion === k.id;
            return (
              <button
                key={k.id}
                type="button"
                aria-pressed={active}
                onClick={() => setKollektion(active ? null : k.id)}
                style={{ ["--k" as string]: k.color }}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-[var(--k)] bg-[color-mix(in_oklab,var(--k)_12%,transparent)]"
                    : "border-border hover:border-[var(--k)]"
                }`}
              >
                <span
                  aria-hidden
                  className="block size-6 rounded-full bg-[var(--k)] opacity-90"
                />
                <span className="mt-3 block text-sm leading-snug">{k.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{k.note}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-full border border-border px-5 py-3 text-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filter
          </span>
          <span className="text-xs text-muted-foreground">
            {activeTags.length > 0 ? `${activeTags.length} aktiv` : "Alle"}
          </span>
        </button>
        {open && (
          <div className="mt-6 rounded-2xl border border-border p-5">{panel}</div>
        )}
      </div>

      <div className="hidden md:block">{panel}</div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border pt-5 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {activeTags.length === 0 ? (
            <span className="text-xs text-muted-foreground">Keine Filter aktiv</span>
          ) : (
            <>
              {activeTags.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={t.remove}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground px-3 py-1.5 text-xs transition-opacity hover:opacity-70"
                >
                  {t.label}
                  <X className="size-3" strokeWidth={2} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setWirkung([]);
                  setKollektion(null);
                }}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Zurücksetzen
              </button>
            </>
          )}
        </div>
        <p aria-live="polite" className="shrink-0 text-xs text-muted-foreground">
          {list.length} {list.length === 1 ? "Produkt" : "Produkte"}
        </p>
      </div>

      {relaxed && (
        <p className="mt-5 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground">
          Keine exakten Treffer – ähnliche Produkte. Die Kollektion wurde für diese Ansicht
          gelockert, Ihr Wirkprofil bleibt aktiv.
        </p>
      )}

      <div className="mt-10 grid auto-rows-fr grid-cols-3 items-stretch gap-x-3 gap-y-10 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-12">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}