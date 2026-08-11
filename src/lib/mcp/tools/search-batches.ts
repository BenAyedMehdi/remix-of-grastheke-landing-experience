import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_batches",
  title: "Chargen suchen",
  description:
    "Sucht Grastheke-Chargen nach Chargennummer, Produktname oder Sorte und liefert die wichtigsten Kennwerte (THC, CBD, Status).",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Suchbegriff, z. B. eine Chargennummer oder ein Produktname."),
    limit: z.number().int().optional().describe("Maximale Trefferzahl (Standard 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Nicht angemeldet." }], isError: true };
    const supabase = supabaseForUser(ctx);
    let request = supabase
      .from("batches")
      .select(
        "batch_number, product_name, cultivar, thc_percent, cbd_percent, status, packaged_date, best_before",
      )
      .order("packaged_date", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));
    if (query) {
      request = request.or(
        `batch_number.ilike.%${query}%,product_name.ilike.%${query}%,cultivar.ilike.%${query}%`,
      );
    }
    const { data, error } = await request;
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { batches: data ?? [] },
    };
  },
});