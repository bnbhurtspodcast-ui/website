import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getEpisodes } from '@/lib/rss'
import { EpisodeCard } from '@/components/EpisodeCard'
import { HeroSection } from '@/components/HeroSection'
import { createClient } from '@/lib/supabase/server'
import type { CalendarEvent, Host } from '@/types'
import type { EventWithHosts } from '@/components/EventGoingSection'

export const revalidate = 3600 // 1 hour ISR

export default async function HomePage() {
  const allEpisodes = await getEpisodes()
  const featuredEpisodes = allEpisodes.slice(0, 3)

  // Fetch events for the next 14 days where a host is attending via task assignment
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Tasks linked to events carry the attending host IDs in assignee_ids
  const { data: taskRows } = await supabase
    .from('tasks')
    .select('event_id, assignee_ids')
    .not('event_id', 'is', null)
    .not('assignee_ids', 'eq', '{}')
    .is('archived_at', null)

  const attendanceMap = new Map<string, string[]>() // event_id → host ids
  for (const t of (taskRows ?? [])) {
    if (!t.event_id) continue
    const existing = attendanceMap.get(t.event_id) ?? []
    for (const id of (t.assignee_ids ?? [])) {
      if (!existing.includes(id)) existing.push(id)
    }
    attendanceMap.set(t.event_id, existing)
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
      }))
    }
  }

  return (
    <div>
      {/* Hero + Stats + Events + Subscribe — client component for motion */}
      <HeroSection episodeCount={allEpisodes.length} upcomingEvents={upcomingEvents} />

      {/* Featured Episodes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="font-black uppercase leading-none tracking-tight mb-2"
                style={{
                  fontFamily: 'var(--font-barlow), sans-serif',
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  color: 'white',
                }}
              >
                Latest Episodes
              </h2>
              <p className="font-medium text-sm uppercase tracking-widest" style={{ color: 'rgba(250,162,27,0.8)' }}>
                Fresh from the feed
              </p>
            </div>
            <Link
              href="/episodes"
              className="rave-nav-link hidden sm:inline-flex items-center gap-2 font-bold text-sm"
            >
              View All
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {featuredEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 font-bold text-sm"
              style={{ color: '#FAA21B' }}
            >
              View All Episodes
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
