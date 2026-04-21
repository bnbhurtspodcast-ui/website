-- Show Invitations: people can invite the podcast hosts to their events
CREATE TABLE IF NOT EXISTS public.invitations (
  id             uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  event_name     text NOT NULL,
  event_date     date,
  event_type     text NOT NULL DEFAULT 'event'
                   CHECK (event_type IN ('event','festival','concert','club_night','other')),
  venue_name     text,
  venue_location text,
  is_free        boolean NOT NULL DEFAULT true,
  ticket_price   text,
  description    text,
  contact_name   text NOT NULL,
  contact_email  text NOT NULL,
  contact_phone  text,
  message        text,
  status         text NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','reviewed','accepted','declined')),
  reviewed_by    text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_status     ON public.invitations (status);
CREATE INDEX IF NOT EXISTS idx_invitations_event_date ON public.invitations (event_date);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an invitation
CREATE POLICY invitations_insert ON public.invitations
  FOR INSERT TO public WITH CHECK (true);

-- Authenticated admin users can read
CREATE POLICY invitations_select_admin ON public.invitations
  FOR SELECT TO authenticated USING (true);

-- Authenticated admin users can update status
CREATE POLICY invitations_update_admin ON public.invitations
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated admin users can delete
CREATE POLICY invitations_delete_admin ON public.invitations
  FOR DELETE TO authenticated USING (true);
