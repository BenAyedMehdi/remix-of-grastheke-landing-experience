import { createFileRoute } from "@tanstack/react-router";
import { DropsSection } from "@/components/site/DropsSection";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Drops — Grastheke" },
      {
        name: "description",
        content:
          "Aktuelle Drops, Restocks und fachliche Hinweise der Grastheke Partnerapotheken – neue Genetiken und Lieferwochen im Überblick.",
      },
      { property: "og:title", content: "News & Drops — Grastheke" },
      {
        property: "og:description",
        content: "Neue Genetiken, Restocks und Hinweise zur Rezeptübermittlung.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
      <Breadcrumbs />
      <p className="text-eyebrow">News & Drops</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
        Was gerade verfügbar ist
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Neue Genetiken, Restocks und fachliche Hinweise. Alle Inhalte sind Platzhalter.
      </p>
      <div className="mt-14">
        <DropsSection />
      </div>
    </section>
  );
}