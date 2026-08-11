import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StarRating } from "@/components/site/StarRating";
import { useSession } from "@/hooks/use-session";
import { getPendingReviews, moderateReview, ratingAspects } from "@/lib/reviews";

export function ReviewModeration() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: getPendingReviews,
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      moderateReview(id, status, reasons[id] ?? "", user!.id),
    onSuccess: () => {
      toast.success("Bewertung bearbeitet.");
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["batch-reviews"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Aktion fehlgeschlagen."),
  });

  return (
    <div className="mt-20 border-t border-border pt-12">
      <h2 className="text-2xl font-medium tracking-tight">
        Bewertungen prüfen
        {pending.length > 0 && (
          <span className="ml-3 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground align-middle">
            {pending.length}
          </span>
        )}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Bestellnummer im Warenwirtschaftssystem abgleichen und die Bewertung anschließend
        für die Öffentlichkeit freigeben oder ablehnen.
      </p>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Wird geladen …</p>}
      {!isLoading && pending.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          Keine offenen Bewertungen zur Prüfung.
        </p>
      )}

      <ul className="mt-8 space-y-8">
        {pending.map((review) => {
          const verification = Array.isArray(review.review_verifications)
            ? review.review_verifications[0]
            : review.review_verifications;
          return (
            <li key={review.id} className="border border-border p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StarRating value={review.rating_overall} size="size-4" />
                <span className="text-sm">{review.title ?? "Ohne Titel"}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {review.batches?.batch_number} · {review.batches?.product_name}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {review.display_name ?? "Patient:in"} ·{" "}
                {new Date(review.created_at).toLocaleDateString("de-DE")}
                {review.consumption_method ? ` · ${review.consumption_method}` : ""}
              </p>
              <p className="mt-2 text-sm">
                Bestellnummer:{" "}
                <span className="font-mono">{verification?.order_number ?? "—"}</span>
                {verification?.pharmacy ? ` · ${verification.pharmacy}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                {review.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {ratingAspects.map(([field, label]) =>
                  review[field] ? (
                    <span
                      key={field}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      {label}
                      <StarRating value={review[field] as number} size="size-3" />
                    </span>
                  ) : null,
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={moderate.isPending}
                  onClick={() => moderate.mutate({ id: review.id, status: "approved" })}
                  className="rounded-full bg-foreground px-5 py-2.5 text-xs text-background transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  Freigeben
                </button>
                <input
                  placeholder="Ablehnungsgrund"
                  value={reasons[review.id] ?? ""}
                  onChange={(e) =>
                    setReasons((prev) => ({ ...prev, [review.id]: e.target.value }))
                  }
                  className="w-56 rounded-md border border-border bg-background px-3 py-2 text-xs outline-none focus:border-foreground"
                />
                <button
                  type="button"
                  disabled={moderate.isPending}
                  onClick={() => moderate.mutate({ id: review.id, status: "rejected" })}
                  className="rounded-full border border-border px-5 py-2.5 text-xs transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50"
                >
                  Ablehnen
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}