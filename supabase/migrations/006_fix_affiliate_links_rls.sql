-- ─── 006: fix affiliate_links RLS write policies ─────────────────────────────
-- The INSERT/UPDATE/DELETE policies used (auth.jwt() ->> 'user_role') = 'admin'
-- but this custom claim is not set in JWTs. All other admin-write tables in this
-- project use TO authenticated WITH CHECK (true). Align to that pattern.

DROP POLICY IF EXISTS affiliate_links_insert ON public.affiliate_links;
DROP POLICY IF EXISTS affiliate_links_update ON public.affiliate_links;
DROP POLICY IF EXISTS affiliate_links_delete ON public.affiliate_links;

CREATE POLICY affiliate_links_insert ON public.affiliate_links
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY affiliate_links_update ON public.affiliate_links
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY affiliate_links_delete ON public.affiliate_links
  FOR DELETE TO authenticated
  USING (true);
