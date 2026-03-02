import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { EpisodeCard } from '@/components/EpisodeCard'
import type { Episode } from '@/types'

interface FeaturedEpisodesProps {
  episodes: Episode[]
}

export function FeaturedEpisodes({ episodes }: FeaturedEpisodesProps) {
  return (
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
            className="rave-nav-link inline-flex items-center gap-2 font-bold text-sm"
          >
            View All
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: horizontal scroll — desktop: 3-col grid */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-none overflow-y-hidden">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {episodes.map((episode) => (
              <div key={episode.id} className="w-72 flex-shrink-0">
                <EpisodeCard episode={episode} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </section>
  )
}
