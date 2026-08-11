import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, PhoneCall } from "lucide-react";
import { getGramMembership, gramDrops, gramServices } from "@/lib/gram";
import { GramMark } from "@/components/site/GramMark";

export const Route = createFileRoute("/_authenticated/gram")({
  head: () => ({
    meta: [
      { title: "the gram — Mitgliederbereich | Grastheke" },
      {
        name: "description",
        content:
          "Exklusive Chargen-Drops, Vorabzugriff und persönliche Betreuung für Mitglieder von the gram.",
      },
      { property: "og:title", content: "the gram — Mitgliederbereich" },
      { property: "og:description", content: "Drops und Services für Mitglieder." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Grastheke" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: "https://grastheke-landing-express.lovable.app/gram" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "the gram — Mitgliederbereich" },
      { name: "twitter:description", content: "Drops und Services für Mitglieder." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://grastheke-landing-express.lovable.app/gram" }],
  }),
  component: GramMemberArea,
});

function GramMemberArea() {
  const navigate = useNavigate();
  const membership = useQuery({
    queryKey: ["gram-membership"],
    queryFn: getGramMembership,
  });

  useEffect(() => {
    if (!membership.isLoading && membership.data === null) {
      navigate({ to: "/the-gram", replace: true });
    }
  }, [membership.isLoading, membership.data, navigate]);

  if (membership.isLoading || !membership.data) {
    return (
      <div className="min-h-screen bg-foreground text-background">
        <p className="px-5 pt-40 text-sm opacity-60 md:px-10">Zugang wird geprüft …</p>
      </div>
    );
  }

  const joined = new Date(membership.data.joined_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-foreground text-background">
      <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] opacity-50">
              Mitglied seit {joined}
            </p>
            <h1 className="mt-6 text-[2.8rem] font-medium leading-[0.95] tracking-tight md:text-7xl">
              <GramMark size={56} className="gap-5" />
            </h1>
          </div>
          <span className="rounded-full border border-background/25 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] opacity-70">
            {membership.data.tier} · {membership.data.invite_code ?? "—"}
          </span>
        </div>

        <section className="mt-20">
          <p className="text-xs uppercase tracking-[0.45em] opacity-50">Aktuelle Drops</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-background/15 bg-background/15">
            {gramDrops.map((drop) => (
              <article
                key={drop.code}
                className="group flex flex-col gap-4 bg-foreground p-8 transition-colors hover:bg-background/5 md:flex-row md:items-center md:justify-between md:p-10"
              >
                <div>
                  <p className="font-mono text-xs opacity-40">{drop.code}</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight">{drop.name}</h2>
                  <p className="mt-2 text-sm opacity-60">{drop.detail}</p>
                  <p className="mt-1 text-sm opacity-40">{drop.stock}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full border border-background/25 px-3 py-1 text-xs uppercase tracking-[0.2em] opacity-70">
                    {drop.state}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm text-foreground transition-opacity hover:opacity-85"
                  >
                    <Sparkles className="size-4" strokeWidth={1.5} />
                    Reservieren
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs uppercase tracking-[0.45em] opacity-50">Ihre Leistungen</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-background/15 bg-background/15 sm:grid-cols-2">
            {gramServices.map((service) => (
              <div key={service.title} className="bg-foreground p-8 md:p-10">
                <h3 className="text-lg font-medium tracking-tight">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-60">{service.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-background/15 p-8 md:p-12">
          <PhoneCall className="size-5 opacity-70" strokeWidth={1.5} />
          <h2 className="mt-5 text-2xl font-medium tracking-tight md:text-3xl">
            Ihr persönlicher Ansprechpartner
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-60">
            Fragen zu einer Charge, Wunschprofil hinterlegen oder Reservierung ändern –
            wir melden uns innerhalb von zwei Stunden.
          </p>
          <Link
            to="/kontakt"
            className="mt-8 inline-flex rounded-full border border-background/30 px-6 py-3 text-sm transition-colors hover:bg-background hover:text-foreground"
          >
            Kontakt aufnehmen
          </Link>
        </section>

        <div className="mt-16">
          <Link to="/chargen" className="text-sm underline underline-offset-4 opacity-60 hover:opacity-100">
            Zurück zur Chargendokumentation
          </Link>
        </div>
      </div>
    </div>
  );
}
