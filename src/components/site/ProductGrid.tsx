import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { products, type Product } from "@/lib/data";

const filters = ["Alle", "Entspannung", "Fokus", "Energie"] as const;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/sortiment/$slug"
      params={{ slug: product.slug }}
      className="group block"
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
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="tracking-tight">{product.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.genetics} · {product.profile}
          </p>
        </div>
        <p className="text-right text-sm text-muted-foreground">
          THC {product.thc}
          <br />
          CBD {product.cbd}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Alle");
  const list = filter === "Alle" ? products : products.filter((p) => p.profile === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}