'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { EpisodeCard } from './EpisodeCard'
import type { Episode } from '@/types'

interface EpisodesClientProps {
  episodes: Episode[]
}

export function EpisodesClient({ episodes }: EpisodesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = episodes.filter((ep) => {
    const q = searchQuery.toLowerCase()
    return ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q)
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Episodes</h1>
          <p className="text-xl text-[#FAA21B] font-medium">
            Explore our complete collection of conversations
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FAA21B]" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#FAA21B]/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/80">
            Showing <span className="font-bold text-[#FAA21B]">{filtered.length}</span>{' '}
            episode{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Episodes Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#FAA21B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-[#FAA21B]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No episodes found</h3>
            <p className="text-white/60">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
