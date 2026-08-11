import { Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, FlaskConical, Truck } from "lucide-react";
import { products } from "@/lib/data";

type Partner = {
  id: string;
  name: string;
  claim: string;
  icon: typeof Leaf;
};

const partners: Partner[] = [
  { id: "a", name: "Partner A", claim: "EU-GMP Produktion", icon: Leaf },
  { id: "b", name: "Partner B", claim: "Analytik & CoA", icon: FlaskConical },
  { id: "c", name: "Partner C", claim: "Pharmazeutischer Großhandel", icon: Truck },
  { id: "d", name: "Partner D", claim: "Qualitätssicherung", icon: ShieldCheck },
];

const highlightSlugs = ["nachtflor-22", "klarfeld-18", "weissharz-26", "bernstein-14"];
const highlights = highlightSlugs
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is (typeof products)[number] => Boolean(p));

export function PartnerHighlightSection() {
  return (
    <section
      className="border-y border-border bg-background"
      aria-labelledby="partner-highlight-title"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow">Kuratiert</p>
            <h2
              id="partner-highlight-title"
              className="mt-4 max-w-xl text-3xl font-medium tracking-tight md:text-5xl"
            >
              Unsere Partner &amp; Highlight-Sorten
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Eine bewusst kleine Auswahl – von unserem Team geprüft, nicht beworben.
          </p>
        </div>

        {/* Partner */}
        <div className="mt-14">
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Partner
          </h3>
          <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
            {partners.map((partner) => (
              <li
                key={partner.id}
                className="group w-[66vw] shrink-0 snap-start rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft sm:w-[40vw] md:w-auto"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft">
                  <partner.icon
                    className="size-5 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <p className="mt-4 text-base font-medium tracking-tight">{partner.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{partner.claim}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Highlight-Sorten */}
        <div className="mt-16">
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Highlight-Sorten
          </h3>
          <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
            {highlights.map((product, index) => (
              <li
                key={product.slug}
                className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-auto"
              >
                <Link
                  to="/sortiment/$slug"
                  params={{ slug: product.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={`${product.name} – Blüte (Platzhalterbild)`}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium tracking-tight">{product.name}</h4>
                      {index === 0 && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.12em] text-accent">
                          Empfehlung
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.short}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border px-2.5 py-1">
                        {product.profile}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1">
                        {product.genetics}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1">
                        THC {product.thc}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Ausgewählt von uns – keine bezahlte Platzierung.
        </p>
      </div>
    </section>
  );
}