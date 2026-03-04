-- ─── 002: Fix contact_submissions email check constraint ──────────────────────
-- The original constraint used '\\.' in the SQL string literal, which PostgreSQL
-- interprets as the regex '\.' (escaped backslash + any char), not a literal dot.
-- This caused every insert to fail. The correct regex escape for a literal dot
-- in a PostgreSQL string literal is '\.' (single backslash).
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT contact_submissions_email_check;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_email_check
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
