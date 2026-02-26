'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { EpisodeCard } from '@/components/EpisodeCard'
import type { Episode } from '@/types'

type FilterType = 'all' | 'regular' | 'sts'

interface EpisodesClientProps {
  episodes: Episode[]
}

export function EpisodesClient({ episodes }: EpisodesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = episodes.filter((ep) => {
    const isSTS = /\bSTS\s*\d+/i.test(ep.title)
    const typeMatch =
      filter === 'all' ||
      (filter === 'sts' && isSTS) ||
      (filter === 'regular' && !isSTS)
    const q = searchQuery.toLowerCase()
    const textMatch = ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q)
    return typeMatch && textMatch
  })

  const pillBase = 'px-5 py-2 rounded-full text-sm transition-all cursor-pointer font-medium'
  const pillActive = 'text-[#112B4F] font-bold'
  const pillInactive = 'text-white/60 hover:text-white border'

  return (
    <div className="pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1
            className="font-black uppercase mb-3 leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'white',
            }}
          >
            All Episodes
          </h1>
          <p className="text-lg font-medium" style={{ color: '#FAA21B' }}>
            Explore our complete collection of conversations
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex gap-3 mb-8">
          {(['all', 'regular', 'sts'] as FilterType[]).map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              whileTap={{ scale: 0.95 }}
              className={`${pillBase} ${filter === type ? pillActive : pillInactive}`}
              style={
                filter === type
                  ? { backgroundColor: '#FAA21B', border: '1px solid #FAA21B' }
                  : { borderColor: 'rgba(250,162,27,0.3)', backgroundColor: 'transparent' }
              }
            >
              {type === 'all' ? 'All' : type === 'sts' ? 'STS' : 'Regular'}
            </motion.button>
          ))}
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
              className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition-all text-white placeholder:text-white/40"
              style={{
                border: '1px solid rgba(250,162,27,0.3)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
              }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLInputElement
                el.style.borderColor = '#FAA21B'
                el.style.boxShadow = '0 0 0 3px rgba(250,162,27,0.15)'
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLInputElement
                el.style.borderColor = 'rgba(250,162,27,0.3)'
                el.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
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
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(250,162,27,0.1)', border: '1px solid rgba(250,162,27,0.3)' }}
            >
              <Search className="h-8 w-8 text-[#FAA21B]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No episodes found</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
