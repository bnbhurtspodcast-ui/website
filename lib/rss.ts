import { XMLParser } from 'fast-xml-parser'
import type { Episode } from '@/types'

const RSS_FEED_URL = process.env.RSS_FEED_URL ?? 'https://anchor.fm/s/ee3c58cc/podcast/rss'
const YOUTUBE_FEED_URL =
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCZRn7RdXN8MdFmGotY1E_zA'

export const CHANNEL_IMAGE =
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

interface YouTubeVideo {
  title: string
  videoId: string
  published: string
}

const ytParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => name === 'entry',
})

async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(YOUTUBE_FEED_URL, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const xml = await res.text()
    const parsed = ytParser.parse(xml)
    const entries: Record<string, unknown>[] = parsed?.feed?.entry ?? []
    return entries.map((e) => ({
      title: (e['title'] as string) ?? '',
      videoId: (e['yt:videoId'] as string) ?? '',
      published: (e['published'] as string) ?? '',
    }))
  } catch {
    return []
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ep\.?\s*\d+[:\-–—]?\s*/gi, '') // strip episode numbers
    .replace(/[^a-z0-9\s]/g, '')              // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

function matchVideo(episodeTitle: string, videos: YouTubeVideo[]): string | undefined {
  const epNorm = normalizeTitle(episodeTitle)
  const epWords = new Set(epNorm.split(' ').filter((w) => w.length > 2))

  let bestMatch: YouTubeVideo | undefined
  let bestScore = 0

  for (const video of videos) {
    const vtNorm = normalizeTitle(video.title)
    if (vtNorm.includes(epNorm) || epNorm.includes(vtNorm)) {
      return video.videoId
    }
    const vtWords = vtNorm.split(' ').filter((w) => w.length > 2)
    const shared = vtWords.filter((w) => epWords.has(w)).length
    const score = shared / Math.max(epWords.size, vtWords.length, 1)
    if (score > bestScore) {
      bestScore = score
      bestMatch = video
    }
  }

  return bestScore >= 0.5 ? bestMatch?.videoId : undefined
}

export async function getEpisodesWithVideo(): Promise<Episode[]> {
  const [episodes, videos] = await Promise.all([getEpisodes(), getYouTubeVideos()])
  return episodes.map((ep) => ({
    ...ep,
    youtubeVideoId: matchVideo(ep.title, videos),
  }))
}

export async function searchYouTubeByTitle(title: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&type=video&maxResults=1&q=${encodeURIComponent(title)}&key=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return null
    const data = await res.json() as { items?: Array<{ id?: { videoId?: string } }> }
    return data.items?.[0]?.id?.videoId ?? null
  } catch {
    return null
  }
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
