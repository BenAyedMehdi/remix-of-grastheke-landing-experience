import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Review = Tables<"batch_reviews">;

export type ReviewWithVotes = Review & {
  up: number;
  down: number;
  myVote: -1 | 1 | 0;
};

export type ProductBatch = {
  id: string;
  batch_number: string;
  packaged_date: string | null;
};

export type ProductReview = ReviewWithVotes & { batchNumber: string };

export const ratingAspects = [
  ["rating_aroma", "Aroma"],
  ["rating_taste", "Geschmack"],
  ["rating_effect", "Wirkung"],
  ["rating_consistency", "Konsistenz"],
  ["rating_burn", "Abbrand"],
] as const;

export async function getBatchReviews(batchId: string, userId: string | null) {
  const { data, error } = await supabase
    .from("batch_reviews")
    .select("*")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const reviews = data ?? [];
  if (reviews.length === 0) return [] as ReviewWithVotes[];

  const { data: votes } = await supabase
    .from("review_votes")
    .select("review_id, user_id, value")
    .in(
      "review_id",
      reviews.map((r) => r.id),
    );

  return reviews.map((review) => {
    const own = votes?.find((v) => v.review_id === review.id && v.user_id === userId);
    return {
      ...review,
      up: votes?.filter((v) => v.review_id === review.id && v.value === 1).length ?? 0,
      down: votes?.filter((v) => v.review_id === review.id && v.value === -1).length ?? 0,
      myVote: (own?.value ?? 0) as -1 | 1 | 0,
    };
  });
}

export type ReviewInput = {
  batchId: string;
  userId: string;
  displayName: string;
  orderNumber: string;
  pharmacy: string;
  ratingOverall: number;
  aspects: Partial<Record<(typeof ratingAspects)[number][0], number>>;
  title: string;
  body: string;
  consumptionMethod: string;
};

export async function submitReview(input: ReviewInput) {
  const { data, error } = await supabase
    .from("batch_reviews")
    .insert({
      batch_id: input.batchId,
      user_id: input.userId,
      display_name: input.displayName.trim().slice(0, 60) || "Patient:in",
      rating_overall: input.ratingOverall,
      ...input.aspects,
      title: input.title.trim().slice(0, 120) || null,
      body: input.body.trim(),
      consumption_method: input.consumptionMethod || null,
      status: "pending",
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: verifyError } = await supabase.from("review_verifications").insert({
    review_id: data.id,
    user_id: input.userId,
    order_number: input.orderNumber.trim(),
    pharmacy: input.pharmacy.trim() || null,
  });
  if (verifyError) {
    await supabase.from("batch_reviews").delete().eq("id", data.id);
    throw verifyError;
  }
  return data.id;
}

export async function castVote(reviewId: string, userId: string, value: -1 | 1 | 0) {
  return castVoteImpl(reviewId, userId, value);
}

/** Alle Chargen einer Blüte – Grundlage für den Chargenfilter. */
export async function getProductBatches(productSlug: string) {
  const { data, error } = await supabase
    .from("batches")
    .select("id, batch_number, packaged_date")
    .eq("product_slug", productSlug)
    .eq("status", "published")
    .order("packaged_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductBatch[];
}

/** Bewertungen aller Chargen einer Blüte, inkl. Chargennummer zum Filtern. */
export async function getProductReviews(productSlug: string, userId: string | null) {
  const batches = await getProductBatches(productSlug);
  if (batches.length === 0) return { batches, reviews: [] as ProductReview[] };

  const byId = new Map(batches.map((b) => [b.id, b.batch_number]));
  const { data, error } = await supabase
    .from("batch_reviews")
    .select("*")
    .in("batch_id", [...byId.keys()])
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = data ?? [];
  const { data: votes } = rows.length
    ? await supabase
        .from("review_votes")
        .select("review_id, user_id, value")
        .in(
          "review_id",
          rows.map((r) => r.id),
        )
    : { data: [] as { review_id: string; user_id: string; value: number }[] };

  const reviews: ProductReview[] = rows.map((review) => {
    const own = votes?.find((v) => v.review_id === review.id && v.user_id === userId);
    return {
      ...review,
      batchNumber: byId.get(review.batch_id) ?? "—",
      up: votes?.filter((v) => v.review_id === review.id && v.value === 1).length ?? 0,
      down: votes?.filter((v) => v.review_id === review.id && v.value === -1).length ?? 0,
      myVote: (own?.value ?? 0) as -1 | 1 | 0,
    };
  });

  return { batches, reviews };
}

async function castVoteImpl(reviewId: string, userId: string, value: -1 | 1 | 0) {
  if (value === 0) {
    const { error } = await supabase
      .from("review_votes")
      .delete()
      .eq("review_id", reviewId)
      .eq("user_id", userId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("review_votes")
    .upsert({ review_id: reviewId, user_id: userId, value }, { onConflict: "review_id,user_id" });
  if (error) throw error;
}

export async function getPendingReviews() {
  const { data, error } = await supabase
    .from("batch_reviews")
    .select("*, batches(batch_number, product_name), review_verifications(order_number, pharmacy)")
    .eq("status", "pending")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function moderateReview(
  reviewId: string,
  status: "approved" | "rejected",
  reason: string,
  staffId: string,
) {
  const { error } = await supabase
    .from("batch_reviews")
    .update({
      status,
      rejection_reason: status === "rejected" ? reason.trim() || null : null,
      reviewed_by: staffId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", reviewId);
  if (error) throw error;
}