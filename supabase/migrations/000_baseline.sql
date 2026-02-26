-- ─── Baseline Schema Migration ────────────────────────────────────────────────
-- This is the consolidated baseline representing the full current public schema.
-- Derived from the Supabase-exported snapshots in supabase/fromSuperbase/.
-- Future incremental changes go in 001_<description>.sql, etc.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS public;


-- ─── kanban_columns ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text,
  color text DEFAULT 'gray'::text,
  sort_order integer DEFAULT 0,
  trello_list_id text UNIQUE,
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_public_kanban_columns_name ON public.kanban_columns (name);

ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_kanban_columns_select ON public.kanban_columns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY public_kanban_columns_insert ON public.kanban_columns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- ─── events ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  edmtrain_id bigint UNIQUE,
  name text,
  link text,
  event_date date,
  start_time text,
  end_time text,
  ages text,
  festival_ind boolean DEFAULT false,
  livestream_ind boolean DEFAULT false,
  venue_name text,
  venue_location text,
  venue_address text,
  venue_lat double precision,
  venue_lng double precision,
  artists jsonb DEFAULT '[]'::jsonb,
  notes text,
  synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  hosts uuid[] DEFAULT '{}'::uuid[],
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_public_events_event_date ON public.events (event_date);
CREATE INDEX IF NOT EXISTS idx_public_events_edmtrain_id ON public.events (edmtrain_id);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_events_select ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY public_events_insert ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- ─── hosts ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.hosts (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text,
  photo_url text,
  interests text,
  description text,
  social_links jsonb DEFAULT '[]'::jsonb,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid,
  role text DEFAULT 'host'::text CHECK (role = ANY (ARRAY['host'::text, 'team'::text])),
  PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.hosts
  ADD CONSTRAINT hosts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_public_hosts_user_id ON public.hosts (user_id);

ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_hosts_select_public ON public.hosts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY public_hosts_insert_authenticated ON public.hosts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid())::uuid);


-- ─── contact_submissions ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text,
  email text,
  subject text,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'::text,
  reviewed_by text,
  PRIMARY KEY (id),
  CONSTRAINT contact_submissions_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'::text)
);

CREATE INDEX IF NOT EXISTS idx_public_contact_submissions_email ON public.contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_public_contact_submissions_status ON public.contact_submissions (status);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_contact_submissions_insert ON public.contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY public_contact_submissions_select_admin ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');


-- ─── submission_rate_limits ───────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS public.submission_rate_limits_id_seq;

CREATE TABLE IF NOT EXISTS public.submission_rate_limits (
  id bigint DEFAULT nextval('public.submission_rate_limits_id_seq'::regclass) NOT NULL,
  ip text,
  email text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_public_submission_rate_limits_ip ON public.submission_rate_limits (ip);
CREATE INDEX IF NOT EXISTS idx_public_submission_rate_limits_email ON public.submission_rate_limits (email);

ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_submission_rate_limits_insert ON public.submission_rate_limits
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY public_submission_rate_limits_select ON public.submission_rate_limits
  FOR SELECT
  TO authenticated
  USING (true);


-- ─── guest_applications ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.guest_applications (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text,
  email text,
  phone text,
  expertise text,
  topic_idea text,
  bio text,
  social_media text,
  availability text,
  status text DEFAULT 'pending'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_by text,
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_public_guest_applications_email ON public.guest_applications (email);
CREATE INDEX IF NOT EXISTS idx_public_guest_applications_status ON public.guest_applications (status);

ALTER TABLE public.guest_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_guest_applications_insert ON public.guest_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY public_guest_applications_select_admin ON public.guest_applications
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');


-- ─── sponsorship_inquiries ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sponsorship_inquiries (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  company_name text,
  contact_name text,
  email text,
  phone text,
  website text,
  budget text,
  goals text,
  message text,
  package_interest text,
  status text DEFAULT 'new'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_by text,
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_public_sponsorship_inquiries_email ON public.sponsorship_inquiries (email);
CREATE INDEX IF NOT EXISTS idx_public_sponsorship_inquiries_status ON public.sponsorship_inquiries (status);

ALTER TABLE public.sponsorship_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_sponsorship_inquiries_insert ON public.sponsorship_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY public_sponsorship_inquiries_select_admin ON public.sponsorship_inquiries
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin');


-- ─── tasks ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title text,
  description text DEFAULT ''::text,
  column_id uuid,
  due_date date,
  priority text DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  tags text[] DEFAULT '{}'::text[],
  label_color text,
  sort_order integer DEFAULT 0,
  trello_card_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  archived_at timestamptz,
  event_id uuid,
  assignee_names text[] DEFAULT '{}'::text[],
  assignee_ids uuid[] DEFAULT '{}'::uuid[],
  PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.tasks
  ADD CONSTRAINT tasks_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.kanban_columns(id);

ALTER TABLE IF EXISTS public.tasks
  ADD CONSTRAINT tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);

CREATE INDEX IF NOT EXISTS idx_public_tasks_column_id ON public.tasks (column_id);
CREATE INDEX IF NOT EXISTS idx_public_tasks_event_id ON public.tasks (event_id);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_tasks_select ON public.tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY public_tasks_insert ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
