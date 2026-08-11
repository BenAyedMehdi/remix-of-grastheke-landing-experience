import { createFileRoute } from "@tanstack/react-router";
import pharmacy from "@/assets/pharmacy.jpg";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns — Grastheke" },
      {
        name: "description",
        content:
          "Grastheke verbindet Patientinnen und Patienten mit geprüften Partnerapotheken für medizinisches Cannabis in Deutschland.",
      },
      { property: "og:title", content: "Über uns — Grastheke" },
      {
        property: "og:description",
        content: "Pharmazeutisch begleitet, regional verankert, transparent dokumentiert.",
      },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    title: "Pharmazeutische Begleitung",
    text: "Jede Abgabe erfolgt über eine approbierte Partnerapotheke, inklusive Beratung zu Dosierung und Anwendung.",
  },
  {
    title: "Nachvollziehbare Qualität",
    text: "Zu jeder Charge liegen Analysezertifikate vor. Herkunft, THC- und CBD-Werte sind dokumentiert.",
  },
  {
    title: "Regionale Verfügbarkeit",
    text: "Fünf Standorte, kurze Wege und verlässliche Lieferzeiten – ohne anonyme Versandkette.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
        <p className="text-eyebrow">Über uns</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
          Medizinisches Cannabis, so unaufgeregt wie jede andere Therapie.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Platzhaltertext: Grastheke ist eine Marke für medizinisches Cannabis, die mit
          Partnerapotheken in Deutschland zusammenarbeitet. Wir kuratieren das Sortiment,
          die Apotheke übernimmt Prüfung, Beratung und Abgabe.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <img
          src={pharmacy}
          alt="Helle, moderne Partnerapotheke (Platzhalterbild)"
          loading="lazy"
          width={1440}
          height={960}
          className="aspect-[16/9] w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="bg-background p-8">
              <h2 className="text-xl tracking-tight">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}