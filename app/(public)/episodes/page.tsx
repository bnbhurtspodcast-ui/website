import type { Metadata } from 'next'
import { getEpisodes } from '@/lib/rss'
import { EpisodesClient } from '@/components/EpisodesClient'

export const revalidate = 1800 // 30 min ISR

export const metadata: Metadata = {
  title: 'Episodes',
  description:
    "Browse every episode of Back n' Body Hurts — Toronto's EDM podcast. Deep dives into rave culture, events, artist interviews, and scene talk.",
  keywords: ['EDM podcast episodes', 'rave podcast episodes', 'DJ interview podcast'],
  openGraph: {
    title: "Episodes | Back n' Body Hurts",
    description:
      "Browse every episode of Back n' Body Hurts — Toronto's EDM podcast. Deep dives into rave culture, events, artist interviews, and scene talk.",
    url: '/episodes',
    images: [{ url: '/logo.png', width: 1400, height: 1400, alt: "Back n' Body Hurts Podcast" }],
  },
  twitter: {
    card: 'summary',
    title: "Episodes | Back n' Body Hurts",
    description:
      "Browse every episode of Back n' Body Hurts — Toronto's EDM podcast. Deep dives into rave culture, events, artist interviews, and scene talk.",
    images: ['/logo.png'],
  },
}

export default async function EpisodesPage() {
  const episodes = await getEpisodes()
  return <EpisodesClient episodes={episodes} />
}
