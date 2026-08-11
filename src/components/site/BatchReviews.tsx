import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsDown, ThumbsUp, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "@/components/site/StarRating";
import { useSession } from "@/hooks/use-session";
import {
  castVote,
  getBatchReviews,
  ratingAspects,
  submitReview,
  type ReviewWithVotes,
} from "@/lib/reviews";

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

export function BatchReviews({
  batchId,
  batchNumber,
  productName,
}: {
  batchId: string;
  batchNumber: string;
  productName: string;
}) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["batch-reviews", batchId, user?.id ?? null],
    queryFn: () => getBatchReviews(batchId, user?.id ?? null),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["batch-reviews", batchId] });

  const vote = useMutation({
    mutationFn: ({ reviewId, value }: { reviewId: string; value: -1 | 1 | 0 }) =>
      castVote(reviewId, user!.id, value),
    onSuccess: invalidate,
    onError: () => toast.error("Stimme konnte nicht gespeichert werden."),
  });

  const published = reviews.filter((r) => r.status === "approved");
  const own = reviews.find((r) => r.user_id === user?.id);
  const average =
    published.length > 0
      ? published.reduce((sum, r) => sum + r.rating_overall, 0) / published.length
      : 0;

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">
            Bewertungen zu dieser Charge
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Jede Charge von {productName} wird einzeln bewertet – Cannabis ist ein
            Naturprodukt und unterscheidet sich von Charge zu Charge. Alle Bewertungen
            werden von uns anhand der Bestellnummer auf Echtheit geprüft.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center gap-3 md:justify-end">
            <StarRating value={Math.round(average)} />
            <span className="text-2xl tracking-tight">
              {published.length > 0 ? average.toFixed(1) : "—"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {published.length} geprüfte Bewertung{published.length === 1 ? "" : "en"}
          </p>
        </div>
      </div>

      {published.length > 0 && (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ratingAspects.map(([field, label]) => {
            const values = published
              .map((r) => r[field])
              .filter((v): v is number => typeof v === "number");
            const avg = values.length
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0;
            return (
              <div key={field}>
                <dt className="text-eyebrow">{label}</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm">
                  <StarRating value={Math.round(avg)} size="size-3.5" />
                  <span className="text-muted-foreground">
                    {values.length ? avg.toFixed(1) : "—"}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {own ? (
        <OwnReviewNotice review={own} />
      ) : (
        <div className="mt-10">
          {formOpen ? (
            <ReviewForm
              batchId={batchId}
              batchNumber={batchNumber}
              onDone={() => {
                setFormOpen(false);
                void invalidate();
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85"
            >
              Charge bewerten
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <p className="mt-10 text-sm text-muted-foreground">Bewertungen werden geladen …</p>
      )}

      <ul className="mt-12 space-y-10">
        {published.map((review) => (
          <li key={review.id} className="border-t border-border pt-8">
            <div className="flex flex-wrap items-center gap-3">
              <StarRating value={review.rating_overall} size="size-4" />
              <span className="text-sm">{review.title ?? "Bewertung"}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" strokeWidth={1.5} />
                Bestellung verifiziert
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {review.display_name ?? "Patient:in"} ·{" "}
              {new Date(review.created_at).toLocaleDateString("de-DE")}
              {review.consumption_method ? ` · ${review.consumption_method}` : ""}
            </p>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed">
              {review.body}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
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

            <div className="mt-5 flex items-center gap-2">
              {([1, -1] as const).map((value) => {
                const active = review.myVote === value;
                const Icon = value === 1 ? ThumbsUp : ThumbsDown;
                const isOwn = review.user_id === user?.id;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isOwn || vote.isPending}
                    aria-label={value === 1 ? "Hilfreich" : "Nicht hilfreich"}
                    aria-pressed={active}
                    onClick={() =>
                      vote.mutate({ reviewId: review.id, value: active ? 0 : value })
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors disabled:opacity-40 ${
                      active
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    {value === 1 ? review.up : review.down}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {!isLoading && published.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          Für diese Charge liegen noch keine geprüften Bewertungen vor.
        </p>
      )}
    </div>
  );
}

function OwnReviewNotice({ review }: { review: ReviewWithVotes }) {
  if (review.status === "approved") return null;
  return (
    <div className="mt-10 border border-border p-5">
      <p className="flex items-center gap-2 text-sm">
        <Clock className="size-4" strokeWidth={1.5} />
        {review.status === "pending"
          ? "Ihre Bewertung wird derzeit anhand Ihrer Bestellnummer geprüft."
          : "Ihre Bewertung wurde nicht freigegeben."}
      </p>
      {review.rejection_reason && (
        <p className="mt-2 text-sm text-muted-foreground">
          Begründung: {review.rejection_reason}
        </p>
      )}
    </div>
  );
}

function ReviewForm({
  batchId,
  batchNumber,
  onDone,
}: {
  batchId: string;
  batchNumber: string;
  onDone: () => void;
}) {
  const { user } = useSession();
  const [overall, setOverall] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [displayName, setDisplayName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [method, setMethod] = useState("");

  const save = useMutation({
    mutationFn: () =>
      submitReview({
        batchId,
        userId: user!.id,
        displayName,
        orderNumber,
        pharmacy,
        ratingOverall: overall,
        aspects: Object.fromEntries(
          Object.entries(aspects).filter(([, v]) => v > 0),
        ) as never,
        title,
        body,
        consumptionMethod: method,
      }),
    onSuccess: () => {
      toast.success("Danke! Ihre Bewertung wird geprüft und danach veröffentlicht.");
      onDone();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Bewertung konnte nicht gesendet werden.",
      ),
  });

  const valid = overall > 0 && body.trim().length >= 20 && orderNumber.trim().length >= 3;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) save.mutate();
      }}
      className="border border-border p-6"
    >
      <p className="text-eyebrow">Bewertung zu Charge {batchNumber}</p>

      <div className="mt-5">
        <p className="text-sm">Gesamtbewertung *</p>
        <div className="mt-2">
          <StarRating value={overall} onChange={setOverall} label="Gesamtbewertung" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ratingAspects.map(([field, label]) => (
          <div key={field}>
            <p className="text-eyebrow">{label}</p>
            <div className="mt-2">
              <StarRating
                value={aspects[field] ?? 0}
                size="size-4"
                label={label}
                onChange={(v) => setAspects((prev) => ({ ...prev, [field]: v }))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-eyebrow">
          Bestellnummer * (nur intern sichtbar)
          <input
            required
            maxLength={80}
            className={inputClass}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="z. B. 2026-004512"
          />
        </label>
        <label className="text-eyebrow">
          Apotheke (optional)
          <input
            maxLength={120}
            className={inputClass}
            value={pharmacy}
            onChange={(e) => setPharmacy(e.target.value)}
          />
        </label>
        <label className="text-eyebrow">
          Anzeigename (öffentlich)
          <input
            maxLength={60}
            className={inputClass}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Patient:in"
          />
        </label>
        <label className="text-eyebrow">
          Anwendungsart
          <select
            className={inputClass}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="">Keine Angabe</option>
            <option value="Vaporisator">Vaporisator</option>
            <option value="Inhalation">Inhalation</option>
            <option value="Teezubereitung">Teezubereitung</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-eyebrow">
        Überschrift
        <input
          maxLength={120}
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="mt-4 block text-eyebrow">
        Ihr Bericht * (mind. 20 Zeichen)
        <textarea
          required
          rows={5}
          maxLength={4000}
          className={inputClass}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Konsistenz, Aroma, Wirkung, Verträglichkeit …"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!valid || save.isPending}
          className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          Zur Prüfung einreichen
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Abbrechen
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Ihre Bestellnummer dient ausschließlich der Echtheitsprüfung durch unser Team und
        wird nicht veröffentlicht. Bewertungen ersetzen keine ärztliche Beratung.
      </p>
    </form>
  );
}