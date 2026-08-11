import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CooperationSection } from "@/components/site/CooperationSection";
import { CooperationFAQ } from "@/components/site/CooperationFAQ";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import heroImage from "@/assets/kooperation-hero.jpg";

export const Route = createFileRoute("/apothekenkooperation")({
  head: () => ({
    meta: [
      { title: "Die Apothekenkooperation — grastheke" },
      {
        name: "description",
        content:
          "grastheke ist eine Apothekenkooperation der curaone GmbH: geprüfte Qualitätsstandards, Inspektionen, QM-System, Schulungen und digitale Services für lizenzierte Apotheken.",
      },
      { property: "og:title", content: "Die Apothekenkooperation — grastheke" },
      {
        property: "og:description",
        content:
          "Lizenzierte Apotheken mit geprüften Qualitätsstandards, einheitlichem QM-System und digitalen Services. Jetzt als grastheke-Apotheke bewerben.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Grastheke" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://grastheke-landing-express.lovable.app/apothekenkooperation",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Die Apothekenkooperation — grastheke" },
      {
        name: "twitter:description",
        content:
          "Geprüfte Qualitätsstandards, Inspektionen und digitale Services für lizenzierte grastheke-Apotheken.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://grastheke-landing-express.lovable.app/apothekenkooperation",
      },
    ],
  }),
  component: CooperationPage,
});

function CooperationPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-10 md:pt-8">
        <Breadcrumbs />
      </div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 pb-20 pt-20 md:grid-cols-2 md:px-10 md:pb-28 md:pt-28">
          <div>
            <p className="text-eyebrow fade-up">Die Apothekenkooperation · curaone GmbH</p>
            <h1 className="fade-up mt-6 max-w-2xl text-[2.4rem] font-medium leading-[1.03] tracking-tight md:text-6xl">
              Qualität, die an jedem Standort gleich ist
            </h1>
            <p className="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              grastheke ist eine Kooperation lizenzierter Apotheken: geprüfte
              Qualitätsstandards, ein einheitliches QM-System, regelmäßige Inspektionen und
              digitale Services – für eine verlässliche Versorgung mit medizinischem
              Cannabis.
            </p>
            <div className="fade-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm text-background transition-opacity hover:opacity-85"
              >
                Als Apotheke bewerben
              </Link>
              <Link
                to="/standorte"
                className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                Partnerapotheken ansehen
              </Link>
            </div>
          </div>
          <div className="fade-up relative overflow-hidden rounded-2xl border border-border">
            <img
              src={heroImage}
              alt="Innenraum einer modernen grastheke-Partnerapotheke mit heller, ruhiger Einrichtung"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
      <CooperationSection />
      <CooperationFAQ />
    </div>
  );
}
