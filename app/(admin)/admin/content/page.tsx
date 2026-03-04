import { getEpisodes } from '@/lib/rss'
import { createClient } from '@/lib/supabase/server'
import { ContentClient } from '@/app/(admin)/admin/content/ContentClient'

export const revalidate = 1800

export default async function ContentPage() {
  const supabase = await createClient()

  const [episodes, settingResult] = await Promise.all([
    getEpisodes(),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'highlighted_youtube_url')
      .single(),
  ])

  const currentUrl = settingResult.data?.value ?? null

  return <ContentClient episodes={episodes} currentUrl={currentUrl} />
}
