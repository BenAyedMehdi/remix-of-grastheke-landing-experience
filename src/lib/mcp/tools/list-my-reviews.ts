import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_reviews",
  title: "Eigene Bewertungen",
  description:
    "Listet die Bewertungen der angemeldeten Person inklusive Prüfstatus (in Prüfung, freigegeben, abgelehnt).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Nicht angemeldet." }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("batch_reviews")
      .select(
        "id, created_at, status, rejection_reason, title, body, rating_overall, batches(batch_number, product_name)",
      )
      .eq("user_id", ctx.getUserId() ?? "")
      .order("created_at", { ascending: false });
    if (error)
      return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { reviews: data ?? [] },
    };
  },
});