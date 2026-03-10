-- ─── 005: affiliate_links — add tracking_url and terms columns ───────────────

ALTER TABLE public.affiliate_links
  ADD COLUMN IF NOT EXISTS tracking_url text,
  ADD COLUMN IF NOT EXISTS terms        text,
  ADD COLUMN IF NOT EXISTS website_link text;
