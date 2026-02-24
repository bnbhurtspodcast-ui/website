'use client'

import Link from 'next/link'
import { Play, Calendar, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useAudioPlayer } from './AudioPlayerContext'
import type { Episode } from '@/types'

interface EpisodeCardProps {
  episode: Episode
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { setCurrentEpisode } = useAudioPlayer()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/episodes/${encodeURIComponent(episode.id)}`}
        className="group block rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(10,22,40,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(250,162,27,0.18)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'rgba(250,162,27,0.65)'
          el.style.boxShadow = '0 0 28px rgba(250,162,27,0.18), 0 8px 40px rgba(0,0,0,0.55)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'rgba(250,162,27,0.18)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-transparent to-transparent" />

          {/* Pulsing play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(250,162,27,0)',
                  '0 0 24px rgba(250,162,27,0.85)',
                  '0 0 0px rgba(250,162,27,0)',
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 bg-[#FAA21B] rounded-full flex items-center justify-center shadow-lg"
            >
              <Play className="h-7 w-7 text-[#112B4F] ml-1" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col h-[11rem]">
          <h3
            className="text-lg font-bold mb-2 line-clamp-2 transition-colors group-hover:text-[#FAA21B]"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {episode.title}
          </h3>

          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {episode.description.replace(/<[^>]*>/g, '')}
          </p>

          <div className="flex items-center gap-4 mt-auto text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(episode.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#FAA21B]" />
              <span className="font-medium" style={{ color: 'rgba(250,162,27,0.8)' }}>{episode.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
