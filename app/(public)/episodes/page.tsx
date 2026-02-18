import { getEpisodes } from '@/lib/rss'
import { EpisodesClient } from '@/components/EpisodesClient'

export const revalidate = 1800 // 30 min ISR

export default async function EpisodesPage() {
  const episodes = await getEpisodes()
  return <EpisodesClient episodes={episodes} />
}
