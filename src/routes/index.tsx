import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ScanLine, MapPin, ArrowRight, Building2 } from "lucide-react";
import { LocationPicker } from "@/components/site/LocationPicker";
import { DropsSection } from "@/components/site/DropsSection";
import { ProductGrid } from "@/components/site/ProductGrid";
import { PartnerHighlightSection } from "@/components/site/PartnerHighlightSection";
import { GramMark } from "@/components/site/GramMark";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grastheke — Medizinisches Cannabis. Verlässlich. Regional." },
      {
        name: "description",
        content:
          "Therapie beginnt mit Transparenz: Rezept einreichen, Charge nachvollziehen, Apotheke wählen. Medizinisches Cannabis, digital begleitet.",
      },
      { property: "og:title", content: "Grastheke — Medizinisches Cannabis" },
      {
        property: "og:description",
        content:
          "Partnerapotheken in fünf Städten, kuratiertes Sortiment, pharmazeutische Beratung.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Grastheke" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: "https://grastheke-landing-express.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Grastheke — Medizinisches Cannabis" },
      {
        name: "twitter:description",
        content:
          "Partnerapotheken in fünf Städten, kuratiertes Sortiment, pharmazeutische Beratung.",
      },
    ],
    links: [{ rel: "canonical", href: "https://grastheke-landing-express.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
          <p className="text-eyebrow fade-up">Grastheke · Partnerapotheken in Deutschland</p>
          <h1 className="fade-up mt-6 max-w-4xl text-[2.6rem] font-medium leading-[1.02] tracking-tight md:text-7xl">
            Therapie beginnt mit Transparenz
          </h1>
          <p className="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Rezept einreichen, Charge nachvollziehen, Apotheke wählen. Medizinisches
            Cannabis, digital begleitet – in einer Oberfläche.
          </p>
          <div className="fade-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/standorte"
              onClick={() =>
                trackEvent("location_cta_click", {
                  location: "homepage_hero",
                  label: "Standort wählen",
                })
              }
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm text-background transition-opacity hover:opacity-85"
            >
              Standort wählen
            </Link>
            <Link
              to="/chargen"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              Charge nachvollziehen
            </Link>
          </div>
          <div className="fade-up mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Rezept einreichen",
                text: "E-Rezept oder Papierrezept – direkt an Ihre Partnerapotheke.",
              },
              {
                icon: ScanLine,
                title: "Charge nachvollziehen",
                text: "CoA-Werte, Terpenprofil und Restfeuchte je Chargennummer.",
              },
              {
                icon: MapPin,
                title: "Apotheke wählen",
                text: "Fünf Standorte mit pharmazeutischer Begleitung vor Ort.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-background p-6 md:p-8">
                <item.icon className="size-5 text-accent" strokeWidth={1.5} />
                <h2 className="mt-4 text-base font-medium tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="fade-up mt-8 text-xs text-muted-foreground">
            Abgabe ausschließlich auf ärztliche Verordnung, ab 18 Jahren.
          </p>
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

      <PartnerHighlightSection />

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

      <section
        className="content-visibility-auto border-t border-border bg-foreground text-background"
        aria-labelledby="gram-teaser-title"
        style={{ containIntrinsicSize: "0 320px" }}
      >
        <Link
          to="/the-gram"
          onClick={() =>
            trackEvent("gram_enter_click", {
              source: "homepage_teaser",
            })
          }
          className="group relative mx-auto flex max-w-[1400px] flex-col gap-6 overflow-hidden px-5 py-20 transition-all duration-300 ease-out active:scale-[0.995] md:flex-row md:items-center md:justify-between md:px-10 md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-[0.08] group-active:opacity-[0.12]"
            aria-hidden="true"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.45em] opacity-50 transition-opacity duration-300 group-active:opacity-70">
              ◇ Zugang beschränkt
            </p>
            <h2
              id="gram-teaser-title"
              className="mt-6 text-3xl font-medium tracking-tight opacity-80 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100 md:text-6xl"
            >
              <GramMark size={44} className="gap-4" />
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-50 transition-opacity duration-500 group-hover:opacity-70 group-active:opacity-80">
              Es gibt ein Sortiment, das hier nicht steht. Wer den Code hat, weiß bereits,
              wofür.
            </p>
          </div>
          <span className="relative inline-flex min-h-[3rem] items-center gap-3 self-start rounded-full border border-background/25 bg-background/[0.03] px-6 py-3 text-sm opacity-70 transition-all duration-300 ease-out group-hover:gap-5 group-hover:border-background/40 group-hover:opacity-100 group-active:scale-[0.97] group-active:border-background/60 group-active:bg-background/[0.08] group-active:opacity-100 sm:min-h-[3.25rem]">
            <span className="font-medium">Code eingeben</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-active:translate-x-2"
              strokeWidth={1.5}
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[inset_0_0_24px_color-mix(in_oklab,var(--color-background)_8%,transparent)] transition-opacity duration-300 group-active:opacity-100"
              aria-hidden="true"
            />
          </span>
        </Link>
      </section>

      <section
        className="relative overflow-hidden border-t border-border bg-secondary"
        aria-labelledby="cooperation-teaser-title"
      >
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:py-20 md:px-10 md:py-28">
          <Link
            to="/apothekenkooperation"
            onClick={() =>
              trackEvent("cooperation_cta_click", {
                location: "homepage_after_gram",
                label: "Kooperation entdecken",
              })
            }
            className="group mx-auto flex max-w-2xl items-center gap-5 rounded-[2rem] border border-border bg-background p-5 shadow-soft transition-all duration-300 hover:shadow-[0_12px_40px_-20px_rgb(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:gap-6 sm:p-6 md:max-w-3xl md:rounded-[2.5rem] md:p-8"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-accent/10 bg-accent-soft sm:h-24 sm:w-24 sm:rounded-[1.75rem]">
              <Building2
                className="size-9 text-accent sm:size-10"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Für Apotheken
              </p>
              <h2
                id="cooperation-teaser-title"
                className="mt-1 text-lg font-medium leading-tight tracking-tight text-foreground sm:text-xl md:text-2xl"
              >
                Werde Teil der Apothekenkooperation
              </h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Vernetzte Standorte, gemeinsames QM-System und digitale Services.
              </p>
              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-2">
                Kooperation entdecken
                <ArrowRight
                  className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
