import { createClient } from '@/lib/supabase/server'

/**
 * Returns the currently saved highlighted YouTube URL, or null if none is set.
 * Called from the public homepage (server component, anon RLS policy allows read).
 */
export async function getHighlightedEpisode(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'highlighted_youtube_url')
    .single()
  return data?.value ?? null
}
