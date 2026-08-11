import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/site/ProductGrid";
import { useActiveLocation } from "@/context/location-context";

export const Route = createFileRoute("/sortiment/")({
  head: () => ({
    meta: [
      { title: "Sortiment — Genetiken & Wirkprofile | Grastheke" },
      {
        name: "description",
        content:
          "Das Grastheke Sortiment: medizinische Cannabisblüten nach Wirkprofil und Genetik, mit THC- und CBD-Range sowie Terpenprofil.",
      },
      { property: "og:title", content: "Sortiment — Grastheke" },
      {
        property: "og:description",
        content: "Blüten nach Wirkprofil: Entspannung, Fokus, Energie.",
      },
    ],
  }),
  component: SortimentPage,
});

function SortimentPage() {
  const { activeLocation } = useActiveLocation();

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
      <p className="text-eyebrow">Sortiment</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
        Genetiken nach Wirkprofil
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        {activeLocation
          ? `Verfügbarkeiten für ${activeLocation.pharmacy}, ${activeLocation.city}.`
          : "Wählen Sie einen Standort, um standortbezogene Verfügbarkeiten zu sehen."}{" "}
        Alle Angaben sind Platzhalter. Die Abgabe erfolgt ausschließlich auf ärztliche
        Verordnung.
      </p>
      <div className="mt-14">
        <ProductGrid />
      </div>
    </section>
  );
}