-- ─── 007: fix affiliate_links admin SELECT policy ──────────────────────────
-- The admin_select policy used (auth.jwt() ->> 'user_role') = 'admin' which
-- never matches. Authenticated users only saw active/non-expired rows via the
-- public policy. Fix: allow authenticated users to see all rows.

DROP POLICY IF EXISTS affiliate_links_admin_select ON public.affiliate_links;

CREATE POLICY affiliate_links_admin_select ON public.affiliate_links
  FOR SELECT TO authenticated
  USING (true);
