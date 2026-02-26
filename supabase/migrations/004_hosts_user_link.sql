-- ─── Hosts: add user_id FK + role; migrate events.hosts text[] → uuid[] ──────
-- Run this in the Supabase Dashboard SQL editor (Settings → SQL Editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add nullable user_id FK to hosts
--    (nullable so existing rows don't fail; "required on create" is enforced in app)
ALTER TABLE public.hosts
  ADD COLUMN IF NOT EXISTS user_id uuid
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- 2. Add role column — existing rows automatically get 'host' via DEFAULT
ALTER TABLE public.hosts
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'host'
  CHECK (role IN ('host', 'team'));

-- 3. Migrate events.hosts: text[] (host names) → uuid[] (host IDs)
--    Step A: rename old column so we can reuse the name
ALTER TABLE public.events
  RENAME COLUMN hosts TO hosts_names_old;

--    Step B: add new uuid[] column
ALTER TABLE public.events
  ADD COLUMN hosts uuid[] NOT NULL DEFAULT '{}';

--    Step C: backfill — match old name strings to hosts.id (case-sensitive, best-effort)
UPDATE public.events e
SET hosts = COALESCE(
  (
    SELECT ARRAY_AGG(h.id ORDER BY h.sort_order)
    FROM public.hosts h
    WHERE h.name = ANY(e.hosts_names_old)
  ),
  '{}'
);

--    Step D: drop old text[] column
ALTER TABLE public.events
  DROP COLUMN hosts_names_old;

-- ─── Post-migration: link yikern's auth user to their host record ─────────────
-- Run separately after confirming the host row exists:
--
--   UPDATE public.hosts
--   SET user_id = (SELECT id FROM auth.users WHERE email = 'yikernlooi@gmail.com')
--   WHERE name ILIKE '%yikern%';
