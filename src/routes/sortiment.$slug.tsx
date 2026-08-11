import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products, SHOP_BASE_URL, type Product } from "@/lib/data";
import { useActiveLocation } from "@/context/location-context";

export const Route = createFileRoute("/sortiment/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produkt nicht verfügbar — Grastheke" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${product.genetics} | Grastheke`;
    const description = `${product.name}: ${product.genetics}, Wirkprofil ${product.profile}, THC ${product.thc}, CBD ${product.cbd}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { activeLocation } = useActiveLocation();

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
      <Link
        to="/sortiment"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Zurück zum Sortiment
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="bg-secondary">
          <img
            src={product.image}
            alt={`${product.name} – medizinische Cannabisblüte (Platzhalterbild)`}
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div className="lg:pt-6">
          <p className="text-eyebrow">
            {product.genetics} · {product.profile}
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              ["THC", product.thc],
              ["CBD", product.cbd],
              ["Genetik", product.genetics],
              ["Bestrahlung", product.irradiation],
            ].map(([label, value]) => (
              <div key={label} className="bg-background p-4">
                <dt className="text-eyebrow">{label}</dt>
                <dd className="mt-2 text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <p className="text-eyebrow">Terpenprofil</p>
            <ul className="mt-4 space-y-2">
              {product.terpenes.map((t: Product["terpenes"][number]) => (
                <li
                  key={t.name}
                  className="flex items-baseline justify-between border-b border-border pb-2 text-sm"
                >
                  <span>{t.name}</span>
                  <span className="text-muted-foreground">{t.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">Herkunft: {product.origin}</p>
          </div>

          <a
            href={`${SHOP_BASE_URL}/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm text-accent-foreground transition-opacity hover:opacity-90"
          >
            Jetzt bestellen
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Weiterleitung zum externen Grastheke-Shop. Abgabe nur gegen ärztliche
            Verordnung.
            {activeLocation ? ` Aktiver Standort: ${activeLocation.city}.` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}