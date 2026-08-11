import { createFileRoute } from "@tanstack/react-router";
import { CooperationSection } from "@/components/site/CooperationSection";

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
      <CooperationSection />
    </div>
  );
}
