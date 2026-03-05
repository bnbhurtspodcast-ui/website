import type { MetadataRoute } from 'next'
import { getEpisodes } from '@/lib/rss'

export const revalidate = 1800 // sync with RSS feed cache

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await getEpisodes()

  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://bnbhurtspodcast.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://bnbhurtspodcast.com/episodes', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://bnbhurtspodcast.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://bnbhurtspodcast.com/contact', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://bnbhurtspodcast.com/guest-submission', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://bnbhurtspodcast.com/sponsorship', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://bnbhurtspodcast.com/press-kit', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const episodePages: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `https://bnbhurtspodcast.com/episodes/${encodeURIComponent(ep.id)}`,
    lastModified: ep.publishedAt ? new Date(ep.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...episodePages]
}
