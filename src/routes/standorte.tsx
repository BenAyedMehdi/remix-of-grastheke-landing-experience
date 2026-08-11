import { createFileRoute } from "@tanstack/react-router";
import { LocationPicker } from "@/components/site/LocationPicker";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import pharmacy from "@/assets/pharmacy.jpg";

export const Route = createFileRoute("/standorte")({
  head: () => ({
    meta: [
      { title: "Standorte — Grastheke Partnerapotheken" },
      {
        name: "description",
        content:
          "Alle Grastheke Partnerapotheken in Deutschland: Berlin, Hamburg, Köln, München und Leipzig. Standort wählen und Verfügbarkeiten sehen.",
      },
      { property: "og:title", content: "Standorte — Grastheke Partnerapotheken" },
      {
        property: "og:description",
        content: "Partnerapotheken in fünf deutschen Städten. Jetzt Standort wählen.",
      },
    ],
  }),
  component: StandortePage,
});

function StandortePage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
        <Breadcrumbs />
        <p className="text-eyebrow">Standorte</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          Ihre Partnerapotheke wählen
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Der gewählte Standort bleibt gespeichert und bestimmt, welche Verfügbarkeiten und
          Lieferzeiten Ihnen angezeigt werden.
        </p>
        <div className="mt-14">
          <LocationPicker />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32">
        <img
          src={pharmacy}
          alt="Innenraum einer modernen Partnerapotheke (Platzhalterbild)"
          loading="lazy"
          width={1440}
          height={960}
          className="aspect-[16/9] w-full object-cover"
        />
      </section>
    </>
  );
}