-- ─── 004: affiliate_links ──────────────────────────────────────────────────
-- Stores affiliated links/discount codes displayed on the public homepage.

CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  description text        NOT NULL,
  image_url   text        NOT NULL,
  type        text        NOT NULL CHECK (type IN ('link', 'code')),
  value       text        NOT NULL,
  tracking_url text,
  terms        text,
  expires_at   timestamptz,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

-- Public (anon + authenticated): only active, non-expired rows
CREATE POLICY affiliate_links_public_select ON public.affiliate_links
  FOR SELECT TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admin: see ALL rows regardless of active/expiry (OR'd with public policy)
CREATE POLICY affiliate_links_admin_select ON public.affiliate_links
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Admin write access
CREATE POLICY affiliate_links_insert ON public.affiliate_links
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY affiliate_links_update ON public.affiliate_links
  FOR UPDATE TO authenticated
  USING  ((auth.jwt() ->> 'user_role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');

CREATE POLICY affiliate_links_delete ON public.affiliate_links
  FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');
