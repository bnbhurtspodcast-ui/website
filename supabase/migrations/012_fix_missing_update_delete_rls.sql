-- Fix missing UPDATE/DELETE RLS policies that block non-primary host accounts
-- from updating tasks, events, and host profiles/photos.

-- ─── tasks ────────────────────────────────────────────────────────────────────

CREATE POLICY public_tasks_update ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_tasks_delete ON public.tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── kanban_columns ───────────────────────────────────────────────────────────

CREATE POLICY public_kanban_columns_update ON public.kanban_columns
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_kanban_columns_delete ON public.kanban_columns
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── events ───────────────────────────────────────────────────────────────────

CREATE POLICY public_events_update ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_events_delete ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── hosts ────────────────────────────────────────────────────────────────────

-- Replace the overly-restrictive INSERT policy (was limited to user_id = auth.uid())
-- so that any authenticated user (e.g. primary admin) can create host profiles.
DROP POLICY IF EXISTS public_hosts_insert_authenticated ON public.hosts;

CREATE POLICY public_hosts_insert_authenticated ON public.hosts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY public_hosts_update ON public.hosts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY public_hosts_delete ON public.hosts
  FOR DELETE
  TO authenticated
  USING (true);
