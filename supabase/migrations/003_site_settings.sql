-- ─── 003: site_settings key-value store ─────────────────────────────────────
-- Generic key-value table for CMS settings managed from the admin panel.
-- Initial use: 'highlighted_youtube_url' stores the URL of the video to
-- embed on the public homepage.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text NOT NULL PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public (anon + authenticated) can read — needed for the public homepage
-- to fetch the highlighted episode URL without auth.
CREATE POLICY site_settings_select_public ON public.site_settings
  FOR SELECT TO public USING (true);

-- Only authenticated users (i.e. admins) can insert or update.
CREATE POLICY site_settings_insert_authenticated ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY site_settings_update_authenticated ON public.site_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Seed the initial row so the SELECT on the public homepage
-- always finds a row (value starts as NULL = no video shown).
INSERT INTO public.site_settings (key, value)
VALUES ('highlighted_youtube_url', NULL)
ON CONFLICT (key) DO NOTHING;
