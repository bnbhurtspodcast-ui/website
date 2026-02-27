import { HeroHero } from '@/components/HeroHero'
import { StatsBar } from '@/components/StatsBar'
import { EventGoingSection } from '@/components/EventGoingSection'
import { SubscribeSection } from '@/components/SubscribeSection'
import type { EventWithHosts } from '@/components/EventGoingSection'

interface HeroSectionProps {
  episodeCount: number
  upcomingEvents: EventWithHosts[]
}

export function HeroSection({ episodeCount, upcomingEvents }: HeroSectionProps) {
  return (
    <>
      <HeroHero />
      <StatsBar episodeCount={episodeCount} />
      <EventGoingSection events={upcomingEvents} />
      <SubscribeSection />
    </>
  )
}
