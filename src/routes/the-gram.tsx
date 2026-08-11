import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Lock, MoveRight } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { getGramMembership, redeemGramInvite, gramServices } from "@/lib/gram";
import { GramMark } from "@/components/site/GramMark";

export const Route = createFileRoute("/the-gram")({
  head: () => ({
    meta: [
      { title: "the gram — Zugang nur auf Einladung | Grastheke" },
      {
        name: "description",
        content:
          "the gram ist der geschlossene Kreis von Grastheke: exklusive Chargen-Drops, Vorabzugriff und persönliche pharmazeutische Betreuung. Zutritt ausschließlich per Einladungscode.",
      },
      { property: "og:title", content: "the gram — Zugang nur auf Einladung" },
      {
        property: "og:description",
        content: "Ein geschlossener Kreis. Limitierte Chargen. Zutritt per Code.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Grastheke" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://grastheke-landing-express.lovable.app/the-gram",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "the gram — Zugang nur auf Einladung" },
      {
        name: "twitter:description",
        content: "Ein geschlossener Kreis. Limitierte Chargen. Zutritt per Code.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://grastheke-landing-express.lovable.app/the-gram" },
    ],
  }),
  component: TheGramGate,
});

function TheGramGate() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const membership = useQuery({
    queryKey: ["gram-membership", user?.id],
    enabled: Boolean(user),
    queryFn: getGramMembership,
  });

  useEffect(() => {
    if (membership.data) navigate({ to: "/gram", replace: true });
  }, [membership.data, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/the-gram" } });
      return;
    }
    setBusy(true);
    try {
      await redeemGramInvite(code);
      toast.success("Willkommen im Kreis.");
      navigate({ to: "/gram", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Code ungültig.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-foreground text-background">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_28%,transparent),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1100px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] opacity-50 transition-opacity hover:opacity-100"
          >
            ← Grastheke
          </Link>

          <p className="mt-16 text-xs uppercase tracking-[0.45em] opacity-60">
            Geschlossener Kreis · seit 2024
          </p>
          <h1 className="mt-8 text-[3rem] font-medium leading-[0.95] tracking-tight md:text-[7rem]">
            <GramMark size={88} className="gap-6" />
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed opacity-70 md:text-lg">
            Ein Store im Store. Nicht beworben, nicht auffindbar, nicht käuflich.
            Wer hier ist, wurde eingeladen – von uns oder von jemandem, der bereits
            drin ist.
          </p>

          <div className="mt-16 max-w-md rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur-sm md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] opacity-60">
              <Lock className="size-3.5" strokeWidth={1.5} />
              Zutritt
            </div>

            {loading ? (
              <p className="mt-6 text-sm opacity-60">Prüfe Zugang …</p>
            ) : (
              <>
                <form onSubmit={onSubmit} className="mt-6">
                  <label
                    htmlFor="gram-code"
                    className="text-xs uppercase tracking-[0.2em] opacity-50"
                  >
                    Einladungscode
                  </label>
                  <div className="mt-3 flex items-center gap-2 border-b border-background/30 pb-3">
                    <KeyRound className="size-4 opacity-50" strokeWidth={1.5} />
                    <input
                      id="gram-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full bg-transparent font-mono text-base tracking-[0.2em] outline-none placeholder:opacity-30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={busy || code.trim().length < 3}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm text-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
                  >
                    {busy ? "Wird geprüft …" : "Eintreten"}
                    <MoveRight className="size-4" strokeWidth={1.5} />
                  </button>
                </form>

                <div className="mt-6 border-t border-background/15 pt-6 text-sm opacity-70">
                  {user ? (
                    <p>
                      Angemeldet als {user.email}. Lösen Sie Ihren Code ein, um den
                      Kreis zu betreten.
                    </p>
                  ) : (
                    <p>
                      Bereits Mitglied?{" "}
                      <Link
                        to="/auth"
                        search={{ redirect: "/the-gram" }}
                        className="underline underline-offset-4 hover:opacity-100"
                      >
                        Mit Ihrem Zugang anmelden
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto max-w-[1100px] px-5 py-24 md:px-10 md:py-32">
          <p className="text-xs uppercase tracking-[0.45em] opacity-50">
            Was drinnen wartet
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
            Chargen, die nie in den öffentlichen Katalog kommen.
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-background/15 bg-background/15 sm:grid-cols-2">
            {gramServices.map((service, index) => (
              <div key={service.title} className="bg-foreground p-8 md:p-10">
                <p className="font-mono text-xs opacity-40">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-60">{service.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-8 border-t border-background/10 pt-12 sm:grid-cols-3">
            {[
              { k: "142", v: "Mitglieder aktuell" },
              { k: "3–5", v: "Drops pro Quartal" },
              { k: "72 h", v: "Vorlauf vor öffentlicher Freigabe" },
            ].map((stat) => (
              <div key={stat.v}>
                <p className="text-4xl font-medium tracking-tight md:text-5xl">{stat.k}</p>
                <p className="mt-2 text-sm opacity-50">{stat.v}</p>
              </div>
            ))}
          </div>

          <p className="mt-20 max-w-xl text-sm leading-relaxed opacity-50">
            Neue Plätze werden ausschließlich über bestehende Mitglieder vergeben. Es
            gibt keine Warteliste, keine Bewerbung, keinen Kauf. Abgabe weiterhin
            ausschließlich auf ärztliche Verordnung, ab 18 Jahren.
          </p>
        </div>
      </div>
    </div>
  );
}
