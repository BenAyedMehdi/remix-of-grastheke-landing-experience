import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Patienten-Login — Chargendaten | Grastheke" },
      {
        name: "description",
        content:
          "Melden Sie sich an, um Echtzeit-Chargendaten Ihrer medizinischen Cannabisblüte einzusehen: Terpenprofil, Restfeuchte, CoA-Werte und Betriebsfotos.",
      },
      { property: "og:title", content: "Patienten-Login — Grastheke" },
      {
        property: "og:description",
        content: "Zugang zu Chargendaten und Analysenzertifikaten.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/chargen";
  return value;
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const target = safePath(search.redirect || "/chargen");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
  }, [navigate, target]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.rpc("ensure_profile");
        navigate({ to: target, replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + target },
        });
        if (error) throw error;
        if (data.session) {
          await supabase.rpc("ensure_profile");
          navigate({ to: target, replace: true });
        } else {
          toast.success("Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    try {
      sessionStorage.setItem("grastheke:after-auth", target);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google-Anmeldung fehlgeschlagen.");
        return;
      }
      if (result.redirected) return;
      await supabase.rpc("ensure_profile");
      navigate({ to: target, replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 pb-24 pt-32 md:pt-44">
      <p className="text-eyebrow">Patientenzugang</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
        {mode === "signin" ? "Anmelden" : "Konto erstellen"}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Chargendaten sind ausschließlich für angemeldete Patientinnen und Patienten
        einsehbar.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-eyebrow">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-eyebrow">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-foreground px-6 py-3.5 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {mode === "signin" ? "Anmelden" : "Registrieren"}
        </button>
      </form>

      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="mt-3 w-full rounded-full border border-border px-6 py-3.5 text-sm transition-colors hover:border-foreground disabled:opacity-50"
      >
        Mit Google fortfahren
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {mode === "signin"
          ? "Noch kein Konto? Jetzt registrieren"
          : "Bereits registriert? Zur Anmeldung"}
      </button>

      <Link to="/" className="mt-10 text-sm text-muted-foreground hover:text-foreground">
        ← Zurück zur Startseite
      </Link>
    </section>
  );
}