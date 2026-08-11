import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Welche Voraussetzungen muss eine Apotheke für die grastheke-Lizenz erfüllen?",
    answer:
      "Eine grastheke-Partnerapotheke benötigt eine gültige deutsche Apothekenlizenz, ein einwandfreies Standortkonzept, qualifiziertes Fachpersonal sowie die Bereitschaft, unsere Qualitätsstandards in Beratung, Hygiene, Ausstattung und Service nachzuweisen. Vor der Lizenzierung führen wir ein strukturiertes Bewerbungs- und Prüfungsgespräch durch.",
  },
  {
    question: "Wie oft finden Inspektionen und Qualitätsprüfungen statt?",
    answer:
      "Jede grastheke-Apotheke wird mindestens zweimal jährlich inspiziert – einmal angemeldet und einmal unangemeldet. Zusätzlich ergänzen Mystery-Shopping-Einkäufe sowie regelmäßige Kundenbefragungen das offizielle Prüfprogramm, damit Qualität nicht nur auf dem Papier, sondern im Alltag gelebt wird.",
  },
  {
    question: "Was prüfen die grastheke-Inspektoren konkret vor Ort?",
    answer:
      "Die Inspektionen umfassen Hygiene- und Arbeitsabläufe, Lagerung und Kühlkette, Beratungsqualität, Dokumentation, Einhaltung des QM-Systems sowie die fachliche Kompetenz des Teams. Auch der Markenauftritt und die Kundenfreundlichkeit werden bewertet.",
  },
  {
    question: "Wie ist das Qualitätsmanagement-System aufgebaut?",
    answer:
      "Das grastheke-QM-System ist ein zertifizierter, einheitlicher Rahmen aus Standard Operating Procedures (SOPs), Schulungsplänen, Dokumentationsvorgaben und Eskalationsprozessen. Es deckt Beschaffung, Lagerung, Beratung, Abgabe und Nachsorge ab und wird laufend an neue regulatorische Anforderungen angepasst.",
  },
  {
    question: "Werden auch neue Apotheken bzw. Existenzgründer aufgenommen?",
    answer:
      "Ja. Neben bestehenden Apotheken begleiten wir auch Existenzgründerinnen und -gründer bei der Eröffnung einer neuen Apotheke unter dem grastheke-Konzept. Dabei unterstützen wir bei Standortbewertung, Markenführung, Prozessaufbau und der Vorbereitung auf die Lizenzierung.",
  },
  {
    question: "Was passiert, wenn eine Apotheke die Standards nicht mehr erfüllt?",
    answer:
      "Bei Abweichungen wird zunächst ein Maßnahmenplan mit Nachfrist vereinbart. Bei schwerwiegenden oder wiederholten Verstößen gegen Qualitäts- und Lizenzkriterien kann die grastheke-Lizenz widerrufen werden, um den Anspruch an alle Partnerapotheken gleichermaßen zu sichern.",
  },
  {
    question: "Welche digitalen Services sind in die Kooperation integriert?",
    answer:
      "Lizenzierte Apotheken erhalten Zugang zu unserer zentralen Plattform mit Online-Shop-Anbindung, Rezept-Service, Chargen-Transparenz, Schulungsportal und gemeinsamen Marketing-Tools. Alle Services sind datenschutzkonform und auf den medizinischen Anwendungsfall zugeschnitten.",
  },
];

export function CooperationFAQ() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-eyebrow text-center">Häufige Fragen</p>
          <h2 className="mt-4 text-center text-3xl font-medium tracking-tight md:text-5xl">
            Lizenzierung, Inspektionen & Qualitätsmanagement
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Hier beantworten wir die wichtigsten Fragen für Apotheken, die Teil
            der grastheke-Kooperation werden möchten.
          </p>

          <Accordion type="single" collapsible className="mt-14">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base font-medium hover:no-underline md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
