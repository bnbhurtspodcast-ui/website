-- Add event_id FK to tasks so tasks in the "Events" column can reference a calendar event
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS event_id uuid
  REFERENCES public.events(id)
  ON DELETE SET NULL;
