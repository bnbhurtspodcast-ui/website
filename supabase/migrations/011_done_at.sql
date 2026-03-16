-- Add done_at to track when a task entered the Done column
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS done_at timestamptz;

-- Mark all tasks currently in "Done" with done_at = now()
-- so they expire 1 week from today (matching the new soft-delete policy)
UPDATE public.tasks
SET done_at = now()
WHERE column_id = (SELECT id FROM public.kanban_columns WHERE name = 'Done' LIMIT 1)
  AND done_at IS NULL
  AND archived_at IS NULL;
