import { XMLParser } from 'fast-xml-parser'
import type { Episode } from '@/types'

const RSS_FEED_URL = process.env.RSS_FEED_URL ?? 'https://anchor.fm/s/ee3c58cc/podcast/rss'

const CHANNEL_IMAGE =
  'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39869323/39869323-1702863954938-4037a7dc2fade.jpg'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  // Treat these tags as arrays even when there's only one item
  isArray: (name) => name === 'item',
})

export async function getEpisodes(): Promise<Episode[]> {
  const res = await fetch(RSS_FEED_URL, {
    next: { revalidate: 1800 }, // 30 min ISR
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch RSS feed: ${res.status}`)
  }

  const xml = await res.text()
  const parsed = parser.parse(xml)
  const items: RawItem[] = parsed?.rss?.channel?.item ?? []

  return items.map(parseItem)
}

export async function getEpisodeByGuid(guid: string): Promise<Episode | null> {
  const episodes = await getEpisodes()
  return episodes.find((ep) => ep.id === guid) ?? null
}

// ── Internal types ────────────────────────────────────────────────────────────

interface RawItem {
  title?: string
  description?: string
  pubDate?: string
  guid?: string | { '#text': string }
  enclosure?: { '@_url'?: string; '@_type'?: string; '@_length'?: string }
  'itunes:duration'?: string
  'itunes:image'?: { '@_href'?: string }
  'itunes:episodeType'?: string
  'itunes:explicit'?: string
}

function parseItem(item: RawItem): Episode {
  const guid =
    typeof item.guid === 'object' ? item.guid['#text'] ?? '' : item.guid ?? ''

  return {
    id: guid,
    title: item.title ?? 'Untitled',
    description: item.description ?? '',
    publishedAt: item.pubDate ?? '',
    duration: item['itunes:duration'] ?? '',
    audioUrl: item.enclosure?.['@_url'] ?? '',
    imageUrl: item['itunes:image']?.['@_href'] ?? CHANNEL_IMAGE,
    episodeType: item['itunes:episodeType'] ?? 'full',
  }
}
