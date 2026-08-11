import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthDetails = {
  client?: { name?: string } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id:
      typeof search["authorization_id"] === "string"
        ? (search["authorization_id"] as string)
        : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.pathname + location.searchStr },
      });
    }
    return {};
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get(
      "authorization_id",
    )!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md px-5 pb-24 pt-32">
      <h1 className="text-2xl font-medium tracking-tight">Freigabe nicht möglich</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Diese Autorisierungsanfrage konnte nicht geladen werden:{" "}
        {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "die Anwendung";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Der Autorisierungsserver hat keine Weiterleitung zurückgegeben.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-5 pb-24 pt-32 md:pt-44">
      <p className="text-eyebrow">Zugriff freigeben</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">
        {clientName} mit Ihrem Grastheke-Konto verbinden
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {clientName} kann anschließend in Ihrem Namen auf Chargendaten, Terpenprofile,
        CoA-Werte und Ihre eigenen Bewertungen zugreifen. Sie können die Verbindung
        jederzeit widerrufen.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(true)}
          className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          Zugriff erlauben
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(false)}
          className="rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-foreground disabled:opacity-50"
        >
          Ablehnen
        </button>
      </div>
    </main>
  );
}