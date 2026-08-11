CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.batch_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text,
  rating_overall smallint NOT NULL,
  rating_aroma smallint,
  rating_taste smallint,
  rating_effect smallint,
  rating_consistency smallint,
  rating_burn smallint,
  title text,
  body text NOT NULL,
  consumption_method text,
  status public.review_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (batch_id, user_id),
  CONSTRAINT rating_overall_range CHECK (rating_overall BETWEEN 1 AND 5),
  CONSTRAINT rating_aroma_range CHECK (rating_aroma IS NULL OR rating_aroma BETWEEN 1 AND 5),
  CONSTRAINT rating_taste_range CHECK (rating_taste IS NULL OR rating_taste BETWEEN 1 AND 5),
  CONSTRAINT rating_effect_range CHECK (rating_effect IS NULL OR rating_effect BETWEEN 1 AND 5),
  CONSTRAINT rating_consistency_range CHECK (rating_consistency IS NULL OR rating_consistency BETWEEN 1 AND 5),
  CONSTRAINT rating_burn_range CHECK (rating_burn IS NULL OR rating_burn BETWEEN 1 AND 5),
  CONSTRAINT body_length CHECK (char_length(body) BETWEEN 20 AND 4000),
  CONSTRAINT title_length CHECK (title IS NULL OR char_length(title) <= 120)
);

CREATE INDEX batch_reviews_batch_idx ON public.batch_reviews (batch_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_reviews TO authenticated;
GRANT ALL ON public.batch_reviews TO service_role;
ALTER TABLE public.batch_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews read" ON public.batch_reviews FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_staff(auth.uid())
  OR (
    status = 'approved'
    AND EXISTS (SELECT 1 FROM public.batches b WHERE b.id = batch_id AND b.status = 'published')
  )
);

CREATE POLICY "reviews insert own" ON public.batch_reviews FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "reviews update own pending" ON public.batch_reviews FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "reviews staff moderate" ON public.batch_reviews FOR UPDATE TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "reviews delete own pending" ON public.batch_reviews FOR DELETE TO authenticated
USING ((user_id = auth.uid() AND status = 'pending') OR public.is_staff(auth.uid()));

CREATE TRIGGER batch_reviews_updated_at BEFORE UPDATE ON public.batch_reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.review_verifications (
  review_id uuid PRIMARY KEY REFERENCES public.batch_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  order_number text NOT NULL,
  pharmacy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_number_length CHECK (char_length(order_number) BETWEEN 3 AND 80)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_verifications TO authenticated;
GRANT ALL ON public.review_verifications TO service_role;
ALTER TABLE public.review_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "verifications staff read" ON public.review_verifications FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "verifications insert own" ON public.review_verifications FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.batch_reviews r WHERE r.id = review_id AND r.user_id = auth.uid())
);

CREATE POLICY "verifications update own" ON public.review_verifications FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.batch_reviews r WHERE r.id = review_id AND r.user_id = auth.uid() AND r.status = 'pending')
)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "verifications staff manage" ON public.review_verifications FOR DELETE TO authenticated
USING (public.is_staff(auth.uid()));

CREATE TABLE public.review_votes (
  review_id uuid NOT NULL REFERENCES public.batch_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  value smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, user_id),
  CONSTRAINT vote_value CHECK (value IN (-1, 1))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_votes TO authenticated;
GRANT ALL ON public.review_votes TO service_role;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes read" ON public.review_votes FOR SELECT TO authenticated USING (true);

CREATE POLICY "votes insert own" ON public.review_votes FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.batch_reviews r
    WHERE r.id = review_id AND r.status = 'approved' AND r.user_id <> auth.uid()
  )
);

CREATE POLICY "votes update own" ON public.review_votes FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "votes delete own" ON public.review_votes FOR DELETE TO authenticated
USING (user_id = auth.uid());