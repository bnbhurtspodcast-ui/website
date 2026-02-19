-- ─── Kanban Board Setup Migration ────────────────────────────────────────────
-- Run this in the Supabase Dashboard SQL editor (Settings → SQL Editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create kanban_columns table
create table if not exists public.kanban_columns (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  color          text not null default 'gray',  -- color key (e.g. 'blue'), resolved to Tailwind class in UI
  sort_order     int  not null default 0,
  trello_list_id text unique
);

-- 2. Seed the 14 active Trello lists as columns
insert into public.kanban_columns (name, color, sort_order, trello_list_id) values
  ('On Hold',           'gray',   1,  '67998fd49ac945027f74f1fa'),
  ('Events',            'purple', 2,  '65deba5f787ead4f34effa19'),
  ('To Do',             'blue',   3,  '65deba5f5bdfb78fd8a589e0'),
  ('Episode Planning',  'cyan',   4,  '6790575295d1728aa2cea605'),
  ('Admin',             'orange', 5,  '679057286a35f3c2c8fbd4db'),
  ('Episode Charging',  'yellow', 6,  '69951a14aae1b1d8466dc866'),
  ('Recording Session', 'red',    7,  '679057255f9c472df7c0e402'),
  ('Shorts Posting',    'pink',   8,  '67d0e7a0b49de26956259d29'),
  ('Episode Posting',   'indigo', 9,  '6808260534e185103a6a2629'),
  ('Editing',           'amber',  10, '67905737b8aecce64c49d598'),
  ('Done',              'green',  11, '65deba5face45fb3969b0a6e'),
  ('Benny',             'teal',   12, '68101f4da79cf5e18ba12af5'),
  ('Interview Artits',  'violet', 13, '681027f4b10f5b864a9846eb'),
  ('Yikern',            'lime',   14, '681aacc84179234576b014d3');

-- 3. Create tasks table (fresh — no existing table to migrate)
create table if not exists public.tasks (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text not null default '',
  column_id        uuid not null references public.kanban_columns(id) on delete restrict,
  assignee         text,
  assignee_user_id uuid references auth.users(id) on delete set null,
  due_date         date,
  priority         text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  tags             text[] not null default '{}',
  label_color      text,
  sort_order       integer not null default 0,
  trello_card_id   text unique,
  created_at       timestamptz not null default now()
);
