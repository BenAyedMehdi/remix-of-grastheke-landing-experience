import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_batch_reviews",
  title: "Bewertungen einer Charge",
  description:
    "Listet die freigegebenen Patientenbewertungen zu einer Charge inklusive Teilnoten (Aroma, Geschmack, Wirkung, Konsistenz, Abbrand).",
  inputSchema: {
    batch_number: z.string().trim().describe("Chargennummer, z. B. GT-01."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ batch_number }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Nicht angemeldet." }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data: batch } = await supabase
      .from("batches")
      .select("id")
      .eq("batch_number", batch_number)
      .maybeSingle();
    if (!batch)
      return {
        content: [{ type: "text", text: `Keine Charge ${batch_number} gefunden.` }],
        isError: true,
      };
    const { data, error } = await supabase
      .from("batch_reviews")
      .select(
        "display_name, created_at, title, body, consumption_method, rating_overall, rating_aroma, rating_taste, rating_effect, rating_consistency, rating_burn",
      )
      .eq("batch_id", batch.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { reviews: data ?? [] },
    };
  },
});