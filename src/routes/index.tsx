import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlower from "@/assets/hero-flower.jpg";
import { LocationPicker } from "@/components/site/LocationPicker";
import { DropsSection } from "@/components/site/DropsSection";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grastheke — Medizinisches Cannabis. Verlässlich. Regional." },
      {
        name: "description",
        content:
          "Medizinisches Cannabis über geprüfte Partnerapotheken in Deutschland. Standort wählen, Sortiment nach Wirkprofil ansehen und im Shop bestellen.",
      },
      { property: "og:title", content: "Grastheke — Medizinisches Cannabis" },
      {
        property: "og:description",
        content:
          "Partnerapotheken in fünf Städten, kuratiertes Sortiment, pharmazeutische Beratung.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroFlower}
          alt="Makroaufnahme einer medizinischen Cannabisblüte (Platzhalterbild)"
          width={1920}
          height={1280}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <p className="text-eyebrow fade-up">Grastheke · Partnerapotheken in Deutschland</p>
          <h1 className="fade-up mt-6 max-w-4xl text-[2.6rem] font-medium leading-[1.02] tracking-tight md:text-7xl">
            Medizinisches Cannabis.
            <br />
            Verlässlich. Regional.
          </h1>
          <div className="fade-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/standorte"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm text-background transition-opacity hover:opacity-85"
            >
              Standort wählen
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Abgabe ausschließlich auf ärztliche Verordnung, ab 18 Jahren.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow">Standorte</p>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight md:text-5xl">
              Zuerst den Standort wählen
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Ihre Auswahl wird gespeichert und bestimmt Verfügbarkeit und Lieferzeiten im
            Sortiment.
          </p>
        </div>
        <div className="mt-14">
          <LocationPicker />
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow">Aktuell</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
                Drops & News
              </h2>
            </div>
            <Link
              to="/news"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Alle Meldungen →
            </Link>
          </div>
          <div className="mt-14">
            <DropsSection />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow">Sortiment</p>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight md:text-5xl">
              Nach Wirkprofil sortiert
            </h2>
          </div>
          <Link
            to="/sortiment"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Gesamtes Sortiment →
          </Link>
        </div>
        <div className="mt-14">
          <ProductGrid />
        </div>
      </section>
    </>
  );
}
