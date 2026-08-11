import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ClipboardCheck,
  FileCog,
  BadgeCheck,
  GraduationCap,
  Handshake,
  Smartphone,
  Search,
  LineChart,
  Users,
  ArrowRight,
} from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Strenge Qualitätsstandards",
    text: "Nur Apotheken, die unsere definierten Qualitätskriterien in Beratung, Hygiene, Ausstattung, Sortiment und Servicequalität erfüllen, erhalten die grastheke-Lizenz.",
  },
  {
    icon: ClipboardCheck,
    title: "Regelmäßige Inspektionen",
    text: "Zweimal jährlich werden alle grastheke-Apotheken unangemeldet und angemeldet auf Herz und Nieren geprüft. Wer die Standards nicht mehr erfüllt, verliert die Lizenz.",
  },
  {
    icon: FileCog,
    title: "Eigenes QM-System",
    text: "Jede grastheke-Apotheke arbeitet nach einem einheitlichen, zertifizierten Qualitätsmanagement-System, das Prozesse, Dokumentation und Beratungsqualität absichert.",
  },
  {
    icon: BadgeCheck,
    title: "Einheitlicher Markenauftritt",
    text: "Alle grastheke-Apotheken erkennt man am einheitlichen Erscheinungsbild und Qualitätssiegel – ein Versprechen, das an jedem Standort gleich eingehalten wird.",
  },
  {
    icon: GraduationCap,
    title: "Fort- und Weiterbildung",
    text: "Regelmäßige Schulungen für Apothekenteams sichern fachliche Kompetenz und aktuelles pharmazeutisches Wissen auf hohem Niveau.",
  },
  {
    icon: Handshake,
    title: "Einkaufs- und Verhandlungsvorteile",
    text: "Als Teil der Kooperation profitieren Apotheken von gemeinsamer Einkaufsstärke, exklusiven Konditionen und einem abgestimmten Sortiment inkl. eigener Marken.",
  },
  {
    icon: Smartphone,
    title: "Digitale Services",
    text: "Online-Shop, App-Anbindung, Rezept-Services und Botendienst sorgen für ein modernes, kundenfreundliches Erlebnis in jeder grastheke-Apotheke.",
  },
  {
    icon: Search,
    title: "Mystery-Shopping & Zufriedenheit",
    text: "Anonyme Testkäufe und Kundenbefragungen ergänzen die offiziellen Inspektionen und sichern Beratungs- und Servicequalität laufend ab.",
  },
  {
    icon: LineChart,
    title: "Betriebswirtschaftliche Unterstützung",
    text: "Lizenzierte Apotheken erhalten Unterstützung bei Marketing, Prozessoptimierung und unternehmerischen Fragestellungen durch die curaone GmbH.",
  },
  {
    icon: Users,
    title: "Netzwerk & Erfahrungsaustausch",
    text: "Netzwerktreffen und eine gemeinsame Plattform fördern Best Practices und gemeinsames Wachstum aller grastheke-Apotheken.",
  },
];

export function CooperationSection() {
  return (
    <section
      id="apothekenkooperation"
      className="border-y border-border bg-secondary"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow">Kooperation</p>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight md:text-5xl">
              Die Apothekenkooperation
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            grastheke ist eine Apothekenkooperation der curaone GmbH. Wir lizenzieren
            ausgewählte, erstklassige Apotheken, die höchste Qualitätsstandards in
            Beratung, Service und pharmazeutischer Versorgung erfüllen. Das
            grastheke-Siegel steht für geprüfte Qualität, der Kundinnen und Kunden
            vertrauen können.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title} className="bg-background p-6 md:p-8">
              <item.icon className="size-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-background p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-medium tracking-tight md:text-4xl">
                Werde Teil von grastheke
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Du bist Inhaberin oder Inhaber einer Apotheke und möchtest dich als
                grastheke lizenzieren lassen? Oder du bist Existenzgründerin bzw.
                Existenzgründer und möchtest eine neue Apotheke unter dem
                grastheke-Konzept eröffnen? Wir freuen uns auf deine Bewerbung.
              </p>
            </div>
            <Link
              to="/kontakt"
              hash="bewerbung"
              className="inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-all hover:gap-5 hover:opacity-90 sm:w-auto"
            >
              Bewirb dich jetzt
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}