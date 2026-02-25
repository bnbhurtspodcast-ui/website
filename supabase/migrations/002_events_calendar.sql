-- ─── Events Calendar Migration ───────────────────────────────────────────────

create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),

  -- EDMTrain fields (nullable: manually-created events have no edmtrain_id)
  edmtrain_id      bigint unique,
  name             text not null,
  link             text,
  event_date       date not null,
  start_time       text,
  end_time         text,
  ages             text,
  festival_ind     boolean not null default false,
  livestream_ind   boolean not null default false,

  -- Venue (flattened)
  venue_name       text,
  venue_location   text,
  venue_address    text,
  venue_lat        double precision,
  venue_lng        double precision,

  -- Artists stored as JSONB array: [{id, name, link, b2b_ind}]
  artists          jsonb not null default '[]'::jsonb,

  -- Internal fields
  hosts            text[] not null default '{}',
  notes            text,
  synced_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Index for calendar range queries on event_date
create index if not exists events_event_date_idx on public.events (event_date);

-- Partial unique index for EDMTrain upsert path
create unique index if not exists events_edmtrain_id_idx
  on public.events (edmtrain_id)
  where edmtrain_id is not null;
