import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_batch",
  title: "Chargendetails abrufen",
  description:
    "Liefert alle Daten zu einer Charge: Stammdaten, Terpenprofil, CoA-Laborwerte und Durchschnitt der freigegebenen Patientenbewertungen.",
  inputSchema: {
    batch_number: z
      .string()
      .trim()
      .describe("Chargennummer, z. B. GT-01."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ batch_number }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Nicht angemeldet." }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data: batch, error } = await supabase
      .from("batches")
      .select("*")
      .eq("batch_number", batch_number)
      .maybeSingle();
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    if (!batch)
      return {
        content: [{ type: "text", text: `Keine Charge ${batch_number} gefunden.` }],
        isError: true,
      };

    const [terpenes, labResults, reviews] = await Promise.all([
      supabase
        .from("batch_terpenes")
        .select("name, percent, note")
        .eq("batch_id", batch.id)
        .order("sort_order"),
      supabase
        .from("batch_lab_results")
        .select("category, parameter, value, unit, limit_value, passed")
        .eq("batch_id", batch.id)
        .order("sort_order"),
      supabase
        .from("batch_reviews")
        .select("rating_overall")
        .eq("batch_id", batch.id)
        .eq("status", "approved"),
    ]);

    const ratings = (reviews.data ?? []).map((r) => r.rating_overall);
    const result = {
      batch,
      terpenes: terpenes.data ?? [],
      lab_results: labResults.data ?? [],
      reviews: {
        count: ratings.length,
        average:
          ratings.length > 0
            ? Number(
                (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2),
              )
            : null,
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});