-- Allow anon users to SELECT from submission_rate_limits
-- Required so server actions (running as anon) can count recent submissions for rate limiting
DROP POLICY IF EXISTS public_submission_rate_limits_select ON public.submission_rate_limits;

CREATE POLICY public_submission_rate_limits_select ON public.submission_rate_limits
  FOR SELECT
  TO public
  USING (true);
