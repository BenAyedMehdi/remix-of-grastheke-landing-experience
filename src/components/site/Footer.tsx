import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { locations } from "@/lib/data";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em]">Grastheke</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Medizinisches Cannabis über geprüfte Partnerapotheken in Deutschland.
              Abgabe ausschließlich auf ärztliche Verordnung.
            </p>
          </div>

          <div>
            <p className="text-eyebrow">Standorte</p>
            <ul className="mt-4 space-y-2 text-sm">
              {locations.map((l) => (
                <li key={l.id}>
                  <Link
                    to="/standorte"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-eyebrow">Rechtliches</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Impressum</li>
              <li>Datenschutz</li>
              <li>AGB</li>
              <li>Widerruf</li>
            </ul>
            <p className="text-eyebrow mt-8">Social</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </div>

          <div>
            <p className="text-eyebrow">Newsletter</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Drops, Verfügbarkeiten und fachliche Updates.
            </p>
            <form
              className="mt-4 flex items-center gap-2 border-b border-foreground/30 pb-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setEmail("");
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-Mail-Adresse"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="text-sm transition-colors hover:text-accent">
                →
              </button>
            </form>
            {sent && (
              <p className="mt-2 text-xs text-accent">
                Danke – Anmeldung vorgemerkt (Demo).
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            18+ · Abgabe ausschließlich an volljährige Personen mit gültiger ärztlicher
            Verordnung.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/the-gram"
              aria-label="The Gram"
              title="—"
              className="font-mono tracking-[0.4em] text-muted-foreground/30 transition-colors duration-500 hover:text-foreground"
            >
              ◇ tg
            </Link>
            <p>© 2026 Grastheke · Alle Inhalte sind Platzhalter (Demo)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}