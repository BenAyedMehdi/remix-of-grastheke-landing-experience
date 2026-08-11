import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Batch = Tables<"batches">;
export type BatchTerpene = Tables<"batch_terpenes">;
export type BatchLabResult = Tables<"batch_lab_results">;
export type BatchPhoto = Tables<"batch_photos">;

export async function searchBatches(term: string) {
  let query = supabase
    .from("batches")
    .select("*")
    .order("packaged_date", { ascending: false, nullsFirst: false })
    .limit(50);

  const q = term.trim();
  if (q) {
    query = query.or(
      `batch_number.ilike.%${q}%,product_name.ilike.%${q}%,cultivar.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getBatchByNumber(batchNumber: string) {
  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("batch_number", batchNumber)
    .maybeSingle();
  if (error) throw error;
  if (!batch) return null;

  const [terpenes, labResults, photos] = await Promise.all([
    supabase
      .from("batch_terpenes")
      .select("*")
      .eq("batch_id", batch.id)
      .order("sort_order"),
    supabase
      .from("batch_lab_results")
      .select("*")
      .eq("batch_id", batch.id)
      .order("sort_order"),
    supabase.from("batch_photos").select("*").eq("batch_id", batch.id).order("sort_order"),
  ]);

  const signedPhotos = await Promise.all(
    (photos.data ?? []).map(async (photo) => ({
      ...photo,
      url: await signedUrl("batch-photos", photo.storage_path),
    })),
  );

  return {
    batch,
    terpenes: terpenes.data ?? [],
    labResults: labResults.data ?? [],
    photos: signedPhotos,
    coaUrl: batch.coa_path ? await signedUrl("batch-coa", batch.coa_path) : null,
  };
}

export async function signedUrl(bucket: string, path: string) {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

export function formatNumber(value: number | null, suffix = "") {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toLocaleString("de-DE", { maximumFractionDigits: 3 })}${suffix}`;
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("de-DE");
}