-- ─── 001: Allow anonymous users to read events and tasks ──────────────────
-- The public home page displays upcoming events where hosts are attending.
-- Host attendance is stored in tasks.assignee_ids (via the task board),
-- not in events.hosts, so both tables need anon read access.
-- TO public covers both anon and authenticated roles.
-- The existing authenticated-only policies remain but become redundant (safe).
-- ──────────────────────────────────────────────────────────────────────────

CREATE POLICY public_events_select_anon ON public.events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY public_tasks_select_anon ON public.tasks
  FOR SELECT
  TO public
  USING (true);
