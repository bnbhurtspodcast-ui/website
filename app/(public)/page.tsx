import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getEpisodes } from '@/lib/rss'
import { EpisodeCard } from '@/components/EpisodeCard'
import { HeroSection } from '@/components/HeroSection'

export const revalidate = 3600 // 1 hour ISR

export default async function HomePage() {
  const allEpisodes = await getEpisodes()
  const featuredEpisodes = allEpisodes.slice(0, 3)

  return (
    <div>
      {/* Hero + Stats + Subscribe — client component for motion */}
      <HeroSection episodeCount={allEpisodes.length} />

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
