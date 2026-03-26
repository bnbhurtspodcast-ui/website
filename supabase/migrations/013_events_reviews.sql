-- Extend events table with event_type, description, and reviewed fields
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'event'
    CHECK (event_type IN ('event','festival','livestream','social_post','recording_session')),
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS reviewed boolean NOT NULL DEFAULT false;

-- Backfill event_type from existing boolean flags
UPDATE public.events SET event_type = 'festival'  WHERE festival_ind = true;
UPDATE public.events SET event_type = 'livestream' WHERE livestream_ind = true;

CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events (event_type);

-- New event_reviews table: one review per host per event
CREATE TABLE IF NOT EXISTS public.event_reviews (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id      uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  reviewer_id   uuid NOT NULL REFERENCES auth.users(id),
  sound         integer NOT NULL CHECK (sound BETWEEN 1 AND 5),
  production    integer NOT NULL CHECK (production BETWEEN 1 AND 5),
  vibes         integer NOT NULL CHECK (vibes BETWEEN 1 AND 5),
  venue         integer NOT NULL CHECK (venue BETWEEN 1 AND 5),
  journey       integer NOT NULL CHECK (journey BETWEEN 1 AND 5),
  description   text,
  will_go_again boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reviews_event_id    ON public.event_reviews (event_id);
CREATE INDEX IF NOT EXISTS idx_event_reviews_reviewer_id ON public.event_reviews (reviewer_id);

ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_reviews_select ON public.event_reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY event_reviews_insert ON public.event_reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY event_reviews_update ON public.event_reviews
  FOR UPDATE TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY event_reviews_delete ON public.event_reviews
  FOR DELETE TO authenticated
  USING (reviewer_id = auth.uid());
