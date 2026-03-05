import type { Metadata } from 'next'
import { getEpisodes } from '@/lib/rss'
import { getHighlightedEpisode } from '@/lib/settings'
import { HeroHero } from '@/components/HeroHero'
import { StatsBar } from '@/components/StatsBar'
import { EventGoingSection } from '@/components/EventGoingSection'
import { SubscribeSection } from '@/components/SubscribeSection'
import { FeaturedEpisodes } from '@/components/FeaturedEpisodes'
import { HighlightedEpisode } from '@/components/HighlightedEpisode'
import { createClient } from '@/lib/supabase/server'
import type { CalendarEvent, Host } from '@/types'
import type { EventWithHosts } from '@/components/EventGoingSection'

export const revalidate = 3600 // 1 hour ISR

export const metadata: Metadata = {
  title: {
    absolute: "Back n' Body Hurts Podcast | Toronto EDM & Rave Culture",
  },
  description:
    "Back n' Body Hurts is Toronto's go-to EDM podcast. Opinionated guidance for ravers, DJs, and rave culture enthusiasts. New episodes every two weeks on Spotify, Apple Podcasts & YouTube.",
  keywords: [
    'Toronto EDM podcast',
    'rave culture podcast',
    'electronic music podcast',
    'DJ interviews Toronto',
    'rave scene podcast',
    'EDM community Toronto',
  ],
  alternates: {
    canonical: 'https://bnbhurtspodcast.com',
  },
  openGraph: {
    title: "Back n' Body Hurts Podcast | Toronto EDM & Rave Culture",
    description:
      "Toronto's go-to EDM podcast. Opinionated guidance for ravers, DJs, and rave culture enthusiasts. New episodes every two weeks.",
    url: '/',
    images: [{ url: '/logo.png', width: 1400, height: 1400, alt: "Back n' Body Hurts Podcast" }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bnbhurtspodcast',
    title: "Back n' Body Hurts Podcast | Toronto EDM & Rave Culture",
    description:
      "Toronto's go-to EDM podcast. Opinionated guidance for ravers, DJs, and rave culture enthusiasts. New episodes every two weeks.",
    images: ['/logo.png'],
  },
}

export default async function HomePage() {
  const [allEpisodes, highlightedUrl] = await Promise.all([
    getEpisodes(),
    getHighlightedEpisode(),
  ])
  const featuredEpisodes = allEpisodes.slice(0, 3)

  // Fetch events for the next 14 days where a host is attending via task assignment
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Tasks linked to events carry the attending host IDs in assignee_ids
  const { data: taskRows } = await supabase
    .from('tasks')
    .select('event_id, assignee_ids, description')
    .not('event_id', 'is', null)
    .not('assignee_ids', 'eq', '{}')
    .is('archived_at', null)

  const attendanceMap = new Map<string, string[]>() // event_id → host ids
  const descriptionMap = new Map<string, string>()  // event_id → task description
  for (const t of (taskRows ?? [])) {
    if (!t.event_id) continue
    const existing = attendanceMap.get(t.event_id) ?? []
    for (const id of (t.assignee_ids ?? [])) {
      if (!existing.includes(id)) existing.push(id)
    }
    attendanceMap.set(t.event_id, existing)
    if (t.description && !descriptionMap.has(t.event_id)) {
      descriptionMap.set(t.event_id, t.description)
    }
  }

  let upcomingEvents: EventWithHosts[] = []

  if (attendanceMap.size > 0) {
    const { data: eventRows } = await supabase
      .from('events')
      .select('*')
      .in('id', [...attendanceMap.keys()])
      .gte('event_date', today)
      .lte('event_date', twoWeeksOut)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true })

    const rawEvents = (eventRows as CalendarEvent[]) ?? []

    if (rawEvents.length > 0) {
      const hostIds = [...new Set([...attendanceMap.values()].flat())]
      const { data: hostRows } = await supabase.from('hosts').select('*').in('id', hostIds)
      const hostsById = new Map(((hostRows as Host[]) ?? []).map((h) => [h.id, h]))
      upcomingEvents = rawEvents.map((event) => ({
        ...event,
        attendingHosts: (attendanceMap.get(event.id) ?? [])
          .map((id) => hostsById.get(id))
          .filter((h): h is Host => h !== undefined),
        taskDescription: descriptionMap.get(event.id) ?? null,
      }))
    }
  }

  return (
    <div>
      <HeroHero />
      {highlightedUrl && <HighlightedEpisode youtubeUrl={highlightedUrl} />}
      <FeaturedEpisodes episodes={featuredEpisodes} />
      <StatsBar episodeCount={allEpisodes.length} />
      <EventGoingSection events={upcomingEvents} />
      <SubscribeSection />
    </div>
  )
}
