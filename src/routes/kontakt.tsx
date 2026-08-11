import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { locations } from "@/lib/data";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

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
  const [applied, setApplied] = useState(false);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
      <Breadcrumbs />
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

      <div id="bewerbung" className="mt-24 scroll-mt-28 border-t border-border pt-16">
        <p className="text-eyebrow">Bewerbung</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
          Werde Teil von grastheke
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Du bist Inhaberin oder Inhaber einer Apotheke und möchtest dich als grastheke
          lizenzieren lassen? Oder du bist Existenzgründerin bzw. Existenzgründer und
          möchtest eine neue Apotheke unter dem grastheke-Konzept eröffnen? Wir freuen uns
          auf deine Bewerbung.
        </p>

        <form
          className="mt-12 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(true);
          }}
        >
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              { id: "b-name", label: "Name", type: "text" },
              { id: "b-email", label: "E-Mail", type: "email" },
              { id: "b-phone", label: "Telefon", type: "tel" },
              { id: "b-pharmacy", label: "Apothekenname / Standort", type: "text" },
            ].map((f) => (
              <div key={f.id}>
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
            <div>
              <label htmlFor="b-type" className="text-eyebrow">
                Art der Bewerbung
              </label>
              <select
                id="b-type"
                required
                defaultValue="Bestehende Apotheke"
                className="mt-3 w-full border-b border-foreground/25 bg-transparent pb-2 text-base outline-none transition-colors focus:border-accent"
              >
                <option>Bestehende Apotheke</option>
                <option>Existenzgründung</option>
              </select>
            </div>
          </div>
          <div className="mt-8">
            <label htmlFor="b-message" className="text-eyebrow">
              Nachricht
            </label>
            <textarea
              id="b-message"
              rows={4}
              className="mt-3 w-full resize-none border-b border-foreground/25 bg-transparent pb-2 text-base outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="mt-10 w-full rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Bewerbung absenden
          </button>
          {applied && (
            <p className="mt-4 text-sm text-accent">
              Danke für deine Bewerbung – Demo-Formular ohne Versand.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}