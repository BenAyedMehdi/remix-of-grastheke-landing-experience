import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { locations } from "@/lib/data";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Grastheke" },
      {
        name: "description",
        content:
          "Fragen zu Rezept, Verfügbarkeit oder Anwendung? Kontaktieren Sie Grastheke oder Ihre Partnerapotheke direkt.",
      },
      { property: "og:title", content: "Kontakt — Grastheke" },
      {
        property: "og:description",
        content: "Ansprechpartner für Patientinnen, Patienten und Praxen.",
      },
    ],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
      <p className="text-eyebrow">Kontakt</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
        Wir sind erreichbar
      </h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <form
          className="max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {[
            { id: "name", label: "Name", type: "text" },
            { id: "email", label: "E-Mail", type: "email" },
          ].map((f) => (
            <div key={f.id} className="mb-8">
              <label htmlFor={f.id} className="text-eyebrow">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                required
                className="mt-3 w-full border-b border-foreground/25 bg-transparent pb-2 text-base outline-none transition-colors focus:border-accent"
              />
            </div>
          ))}
          <div className="mb-8">
            <label htmlFor="message" className="text-eyebrow">
              Nachricht
            </label>
            <textarea
              id="message"
              rows={4}
              required
              className="mt-3 w-full resize-none border-b border-foreground/25 bg-transparent pb-2 text-base outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-foreground px-8 py-4 text-sm text-background transition-opacity hover:opacity-85"
          >
            Nachricht senden
          </button>
          {sent && (
            <p className="mt-4 text-sm text-accent">
              Danke für Ihre Nachricht – Demo-Formular ohne Versand.
            </p>
          )}
        </form>

        <div className="grid gap-px self-start bg-border">
          {locations.map((l) => (
            <div key={l.id} className="bg-background p-6">
              <p className="tracking-tight">{l.city}</p>
              <p className="mt-2 text-sm text-muted-foreground">{l.pharmacy}</p>
              <p className="text-sm text-muted-foreground">
                {l.street}, {l.zip} {l.city}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{l.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}