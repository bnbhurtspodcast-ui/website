-- Enable Supabase Realtime for taskboard tables
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table kanban_columns;
