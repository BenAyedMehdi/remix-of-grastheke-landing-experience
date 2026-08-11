import { supabase } from "@/integrations/supabase/client";

export type GramMembership = {
  user_id: string;
  invite_code: string | null;
  tier: string;
  joined_at: string;
};

export async function getGramMembership(): Promise<GramMembership | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("gram_members")
    .select("user_id, invite_code, tier, joined_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return data as GramMembership | null;
}

const messages: Record<string, string> = {
  not_authenticated: "Bitte zuerst anmelden, dann den Code einlösen.",
  invalid_code: "Dieser Code existiert nicht. Prüfen Sie Ihre Einladung.",
  expired: "Dieser Code ist abgelaufen.",
  exhausted: "Dieser Code wurde bereits vollständig eingelöst.",
};

export async function redeemGramInvite(code: string) {
  const { data, error } = await supabase.rpc("redeem_gram_invite", { _code: code });
  if (error) throw error;
  const result = data as { ok: boolean; error?: string; already_member?: boolean };
  if (!result.ok) {
    throw new Error(messages[result.error ?? ""] ?? "Code konnte nicht eingelöst werden.");
  }
  return result;
}

export const gramDrops = [
  {
    code: "TG-001",
    name: "Obsidian Reserve",
    detail: "Small-Batch, 31,4 % THC · handselektiert, 6 Wochen curing",
    stock: "48 Einheiten · Berlin, München",
    state: "Live",
  },
  {
    code: "TG-002",
    name: "Nachtflor Cuvée",
    detail: "Limitierte Chargen-Cuvée aus drei Erntefenstern",
    stock: "26 Einheiten · nur auf Vormerkung",
    state: "Vormerkung",
  },
  {
    code: "TG-003",
    name: "Weißharz Selection No. 4",
    detail: "Terpen-Dominanz Limonen 1,4 % · vollanalytisch dokumentiert",
    stock: "Ankündigung folgt",
    state: "Bald",
  },
] as const;

export const gramServices = [
  {
    title: "Persönlicher Ansprechpartner",
    text: "Direkte Leitung zu einem pharmazeutischen Betreuer – ohne Warteschleife, sieben Tage die Woche.",
  },
  {
    title: "Vorabzugriff auf Drops",
    text: "72 Stunden vor öffentlicher Freigabe, inklusive Reservierung Ihrer Wunschcharge.",
  },
  {
    title: "Chargen auf Anfrage",
    text: "Wir suchen gezielt nach Terpenprofilen, die zu Ihrer Therapie passen, und legen sie zurück.",
  },
  {
    title: "Verkostungsprotokolle",
    text: "Interne Sensorik- und Laborprotokolle, die außerhalb von the gram nicht veröffentlicht werden.",
  },
] as const;
