-- ─── 008: social_posts ──────────────────────────────────────────────────────
-- Stores social media posts for scheduling/planning across platforms.
-- Media files are stored in Supabase Storage bucket 'social-media-uploads'.
-- Media paths are set to NULL when a post is marked as posted (files deleted).

CREATE TABLE IF NOT EXISTS public.social_posts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text,
  description       text        NOT NULL,
  post_type         text        NOT NULL CHECK (post_type IN ('video', 'photo', 'multi')),
  scheduled_at      timestamptz NOT NULL,
  status            text        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  platforms         text[]      NOT NULL DEFAULT '{}',
  media_paths       text[],
  platform_settings jsonb       NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_at ON public.social_posts (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON public.social_posts (status);

ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_posts_select ON public.social_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_posts_insert ON public.social_posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY social_posts_update ON public.social_posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY social_posts_delete ON public.social_posts
  FOR DELETE TO authenticated USING (true);
