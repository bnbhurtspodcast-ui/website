-- Safe upsert for EDMTrain events that preserves manually-edited columns
-- (hosts, notes) when a row already exists.
--
-- Why a function instead of JS upsert?
-- Supabase JS upsert sends INSERT … ON CONFLICT DO UPDATE SET <every column
-- in the payload>.  Columns absent from the payload default to their DB
-- DEFAULT on update — wiping hosts[] and notes on every weekly sync.
-- This function hard-codes the safe column list so manual edits survive.

CREATE OR REPLACE FUNCTION public.upsert_edmtrain_events(
  p_rows jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r jsonb;
BEGIN
  FOR r IN SELECT * FROM jsonb_array_elements(p_rows)
  LOOP
    INSERT INTO public.events (
      edmtrain_id,
      name,
      link,
      event_date,
      start_time,
      end_time,
      ages,
      festival_ind,
      livestream_ind,
      venue_name,
      venue_location,
      venue_address,
      venue_lat,
      venue_lng,
      artists,
      synced_at,
      updated_at
    ) VALUES (
      (r->>'edmtrain_id')::bigint,
      r->>'name',
      r->>'link',
      (r->>'event_date')::date,
      r->>'start_time',
      r->>'end_time',
      r->>'ages',
      (r->>'festival_ind')::boolean,
      (r->>'livestream_ind')::boolean,
      r->>'venue_name',
      r->>'venue_location',
      r->>'venue_address',
      (r->>'venue_lat')::double precision,
      (r->>'venue_lng')::double precision,
      (r->'artists'),
      (r->>'synced_at')::timestamptz,
      (r->>'updated_at')::timestamptz
    )
    ON CONFLICT (edmtrain_id) DO UPDATE SET
      name           = EXCLUDED.name,
      link           = EXCLUDED.link,
      event_date     = EXCLUDED.event_date,
      start_time     = EXCLUDED.start_time,
      end_time       = EXCLUDED.end_time,
      ages           = EXCLUDED.ages,
      festival_ind   = EXCLUDED.festival_ind,
      livestream_ind = EXCLUDED.livestream_ind,
      venue_name     = EXCLUDED.venue_name,
      venue_location = EXCLUDED.venue_location,
      venue_address  = EXCLUDED.venue_address,
      venue_lat      = EXCLUDED.venue_lat,
      venue_lng      = EXCLUDED.venue_lng,
      artists        = EXCLUDED.artists,
      synced_at      = EXCLUDED.synced_at,
      updated_at     = EXCLUDED.updated_at;
      -- hosts and notes are intentionally NOT updated — manual edits are preserved
  END LOOP;
END;
$$;

-- Allow the service-role key (used by admin client) to call this function
GRANT EXECUTE ON FUNCTION public.upsert_edmtrain_events(jsonb) TO service_role;
