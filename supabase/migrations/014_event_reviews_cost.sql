-- Add cost rating column and drop journey column from event_reviews
-- journey is replaced by cost (weighted 5%) in the new scoring formula

ALTER TABLE public.event_reviews
  ADD COLUMN IF NOT EXISTS cost integer NOT NULL DEFAULT 0
    CHECK (cost BETWEEN 0 AND 5);

-- Soft-drop journey: keep existing data intact but mark column as unused
-- To fully remove later: ALTER TABLE public.event_reviews DROP COLUMN journey;
