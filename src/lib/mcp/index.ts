import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchBatchesTool from "./tools/search-batches";
import getBatchTool from "./tools/get-batch";
import listBatchReviewsTool from "./tools/list-batch-reviews";
import listMyReviewsTool from "./tools/list-my-reviews";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "grastheke-landing-experience",
  title: "Grastheke Landing Experience",
  version: "0.1.0",
  instructions:
    "Werkzeuge für Grastheke, eine Marke für medizinisches Cannabis. Chargen suchen (search_batches), Chargendetails inklusive Terpenprofil und CoA-Laborwerten abrufen (get_batch), freigegebene Patientenbewertungen einer Charge lesen (list_batch_reviews) und eigene Bewertungen inklusive Prüfstatus einsehen (list_my_reviews). Alle Daten werden im Namen der angemeldeten Person gelesen.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchBatchesTool, getBatchTool, listBatchReviewsTool, listMyReviewsTool],
});