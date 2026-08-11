import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";
import logoAsset from "@/assets/grastheke-logo.png.asset.json";
import heroFlower from "@/assets/hero-flower.jpg";
import pharmacy from "@/assets/pharmacy.jpg";
import { products, locations, drops, SHOP_BASE_URL } from "@/lib/data";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Grastheke Studio — Therapie in wenigen Klicks" },
      {
        name: "description",
        content:
          "Grastheke Studio: Rezept einreichen, Charge prüfen, Apotheke wählen. Medizinisches Cannabis digital begleitet – in einer Oberfläche.",
      },
      { property: "og:title", content: "Grastheke Studio" },
      {
        property: "og:description",
        content:
          "Rezept, Charge und Apotheke in einer Oberfläche. Medizinisches Cannabis, digital begleitet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: StudioPage,
});

const navItems = [
  { label: "Funktionen", href: "#funktionen" },
  { label: "Sortiment", href: "#sortiment" },
  { label: "Vorteile", href: "#vorteile" },
  { label: "FAQ", href: "#faq" },
];

const features = [
  {
    n: "01",
    title: "Rezept einreichen",
    text: "E-Rezept oder Papierrezept hochladen. Die Apotheke prüft und meldet sich zurück.",
  },
  {
    n: "02",
    title: "Charge nachvollziehen",
    text: "Terpenprofil, Restfeuchte und CoA-Werte zu jeder gelieferten Charge – in Echtzeit.",
  },
  {
    n: "03",
    title: "Apotheke wählen",
    text: "Fünf Partnerapotheken in Deutschland. Verfügbarkeiten standortbezogen sichtbar.",
  },
];

const benefits = [
  "Pharmazeutische Beratung durch approbiertes Personal",
  "Chargenbezogene Laborwerte statt allgemeiner Angaben",
  "Patientenbewertungen, geprüft anhand der Bestellnummer",
  "Versand oder Abholung in der Partnerapotheke",
];

const faqs = [
  {
    q: "Brauche ich ein Rezept?",
    a: "Ja. Medizinisches Cannabis wird ausschließlich auf ärztliche Verordnung abgegeben. E-Rezept und Papierrezept werden akzeptiert.",
  },
  {
    q: "Was steht in der Chargendokumentation?",
    a: "Kennwerte wie THC, CBD, Restfeuchte und Wasseraktivität, das vollständige Terpenprofil sowie die Laborwerte aus dem CoA – inklusive Betriebsfotos.",
  },
  {
    q: "Wie werden Bewertungen geprüft?",
    a: "Patientinnen und Patienten geben bei der Bewertung ihre Bestellnummer an. Das Team prüft diese intern und gibt die Bewertung anschließend frei.",
  },
  {
    q: "Ist das hier eine Bestellplattform?",
    a: "Diese Seite ist eine Designstudie. Bestellungen laufen über den Grastheke-Shop und die jeweilige Partnerapotheke.",
  },
];

function StudioPage() {
  return (
    <div className="theme-studio min-h-screen">
      <StudioNav />
      <Hero />
      <Features />
      <Statement />
      <Sortiment />
      <Benefits />
      <Drops />
      <Faq />
      <CtaFooter />
    </div>
  );
}

function StudioNav() {
  return (
    <header className="sticky top-0 z-40 px-5 pt-5 md:pt-7">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-3xl border border-border bg-card px-4 py-3 shadow-soft md:px-6">
        <Link to="/" className="shrink-0">
          <img
            src={logoAsset.url}
            alt="Grastheke"
            className="h-6 w-auto md:h-7"
          />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#waitlist"
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Zugang sichern
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-16 text-center md:pt-24">
      <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.05] md:text-7xl">
        Therapie beginnt mit
        <br className="hidden md:block" />{" "}
        <span className="inline-flex items-center rounded-3xl bg-accent-soft px-4 py-1 text-accent-foreground">
          Transparenz
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Rezept einreichen, Charge nachvollziehen, Apotheke wählen. Medizinisches
        Cannabis, digital begleitet – in einer Oberfläche.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#waitlist"
          className="rounded-2xl bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Zugang sichern
        </a>
        <Link
          to="/"
          className="rounded-2xl border border-border bg-card px-7 py-4 text-sm font-medium transition-colors hover:border-foreground"
        >
          Zur Hauptseite
        </Link>
      </div>

      <HeroCollage />
    </section>
  );
}

function HeroCollage() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl md:mt-24">
      <div className="dot-grid mx-auto h-64 w-full max-w-3xl rounded-4xl border border-border bg-secondary md:h-96" />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -left-2 top-2 w-[22rem] -rotate-6 rounded-3xl border border-border bg-card p-6 text-left shadow-float">
          <p className="text-lg font-semibold">Chargenprüfung</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Alle Laborwerte zu Ihrer Blüte.
          </p>
          <div className="mt-5 space-y-3">
            <MiniField label="CHARGE" value="GT-01" />
            <MiniField label="RESTFEUCHTE" value="10,4 %" />
          </div>
        </div>

        <div className="absolute -right-2 top-6 w-[22rem] rotate-6 rounded-3xl border border-border bg-card p-6 text-left shadow-float">
          <p className="text-lg font-semibold">Terpenprofil</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Aroma und Wirkprofil im Detail.
          </p>
          <div className="mt-5 space-y-3">
            <Bar label="Myrcen" pct={72} />
            <Bar label="Caryophyllen" pct={48} />
            <Bar label="Limonen" pct={31} />
          </div>
        </div>

        <div className="absolute bottom-[-3rem] left-1/2 w-[26rem] -translate-x-1/2 rotate-2 overflow-hidden rounded-3xl border border-border bg-card shadow-float">
          <img
            src={heroFlower}
            alt="Medizinische Cannabisblüte in Nahaufnahme"
            className="h-40 w-full object-cover"
            loading="lazy"
          />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-left">
              <p className="text-sm font-semibold">Nachtflor 22</p>
              <p className="text-xs text-muted-foreground">Indica · 20–24 % THC</p>
            </div>
            <span className="rounded-xl bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent-foreground">
              Verfügbar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary px-4 py-3">
      <p className="text-[0.625rem] tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{pct} %</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
        {title}
      </h2>
      {text && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

function Features() {
  return (
    <section id="funktionen" className="px-5 pt-40 md:pt-56">
      <SectionHead
        eyebrow="Funktionen"
        title="Alles Wesentliche an einem Ort"
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.n}
            className="group rounded-4xl border border-border bg-card p-8 shadow-soft transition-transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {f.text}
            </p>
            <div className="dot-grid mt-8 h-36 rounded-3xl border border-border bg-secondary" />
            <p className="mt-6 text-sm text-muted-foreground">{f.n}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="px-5 py-28 md:py-40">
      <p className="mx-auto max-w-4xl text-center text-2xl font-medium leading-snug md:text-4xl">
        Jede Charge ist ein Naturprodukt und unterscheidet sich. Wir zeigen die
        Unterschiede, statt sie zu glätten – mit Laborwerten, Fotos aus dem
        Betrieb und geprüften Patientenerfahrungen.
      </p>
    </section>
  );
}

function Sortiment() {
  return (
    <section id="sortiment" className="px-5">
      <SectionHead
        eyebrow="Sortiment"
        title="Genetiken nach Wirkprofil"
        text="Alle Angaben sind Platzhalter. Abgabe ausschließlich auf ärztliche Verordnung."
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <article
            key={p.slug}
            className="overflow-hidden rounded-4xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1"
          >
            <img
              src={p.image}
              alt={`Blüte ${p.name}`}
              className="h-52 w-full object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="rounded-xl bg-accent-soft px-2.5 py-1 text-[0.6875rem] font-medium text-accent-foreground">
                  {p.profile}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.short}</p>
              <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl bg-secondary px-3 py-2">
                  <dt className="text-[0.625rem] tracking-[0.16em] text-muted-foreground">
                    THC
                  </dt>
                  <dd className="mt-0.5 font-medium">{p.thc}</dd>
                </div>
                <div className="rounded-2xl bg-secondary px-3 py-2">
                  <dt className="text-[0.625rem] tracking-[0.16em] text-muted-foreground">
                    CBD
                  </dt>
                  <dd className="mt-0.5 font-medium">{p.cbd}</dd>
                </div>
              </dl>
              <a
                href={`${SHOP_BASE_URL}/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              >
                Zum Shop
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="vorteile" className="px-5 pt-28 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-4xl border border-border bg-card p-6 shadow-soft md:grid-cols-2 md:p-10">
        <div className="overflow-hidden rounded-3xl">
          <img
            src={pharmacy}
            alt="Innenraum einer Partnerapotheke"
            className="h-72 w-full object-cover md:h-[26rem]"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-eyebrow">Vorteile</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Apothekenqualität, digital begleitet
          </h2>
          <ul className="mt-7 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Check className="size-3 text-accent-foreground" strokeWidth={2.5} />
                </span>
                <span className="leading-relaxed text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {locations.map((l) => (
              <span
                key={l.id}
                className="rounded-2xl border border-border px-4 py-2 text-sm"
              >
                {l.city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Drops() {
  return (
    <section className="px-5 pt-28 md:pt-40">
      <SectionHead eyebrow="Aktuelles" title="Drops & Hinweise" />
      <div className="mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
        {drops.map((d) => (
          <article
            key={d.id}
            className="w-[19rem] shrink-0 snap-start overflow-hidden rounded-4xl border border-border bg-card shadow-soft"
          >
            <img
              src={d.image}
              alt={d.title}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-lg bg-secondary px-2 py-1">
                  {d.category}
                </span>
                <span>{d.date}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug">
                {d.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {d.teaser}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-5 pt-28 md:pt-40">
      <SectionHead eyebrow="FAQ" title="Häufige Fragen" />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="rounded-3xl border border-border bg-card px-6 shadow-soft"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium">{f.q}</span>
                {isOpen ? (
                  <Minus className="size-4 shrink-0" strokeWidth={1.75} />
                ) : (
                  <Plus className="size-4 shrink-0" strokeWidth={1.75} />
                )}
              </button>
              {isOpen && (
                <p className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CtaFooter() {
  return (
    <footer id="waitlist" className="px-5 pb-10 pt-28 md:pt-40">
      <div className="mx-auto max-w-6xl rounded-4xl bg-primary px-6 py-16 text-center text-primary-foreground md:px-16 md:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          Zugang zu Grastheke Studio sichern
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-70 md:text-base">
          Designstudie – keine Bestellfunktion. Für Patientinnen und Patienten mit
          gültiger ärztlicher Verordnung.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="studio-email" className="sr-only">
            E-Mail-Adresse
          </label>
          <input
            id="studio-email"
            type="email"
            required
            placeholder="E-Mail-Adresse"
            className="h-14 flex-1 rounded-2xl bg-card px-5 text-sm text-foreground outline-none"
          />
          <button
            type="submit"
            className="h-14 rounded-2xl bg-accent px-7 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Eintragen
          </button>
        </form>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
        <p>18+ · Abgabe ausschließlich auf ärztliche Verordnung.</p>
        <div className="flex gap-6">
          <Link to="/" className="transition-colors hover:text-foreground">
            Hauptseite
          </Link>
          <Link to="/standorte" className="transition-colors hover:text-foreground">
            Standorte
          </Link>
          <Link to="/kontakt" className="transition-colors hover:text-foreground">
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
}