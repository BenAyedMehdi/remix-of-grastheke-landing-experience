ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS product_slug text;

CREATE INDEX IF NOT EXISTS batches_product_slug_idx ON public.batches (product_slug);

UPDATE public.batches SET product_slug = 'nachtflor-22' WHERE batch_number IN ('GT-2026-0812-A', 'GT-01');
UPDATE public.batches SET product_slug = 'klarfeld-18' WHERE batch_number = 'GT-2026-0805-K';