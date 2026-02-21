'use client'

import Link from 'next/link'
import { Play, Calendar, Clock } from 'lucide-react'
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
    <Link
      href={`/episodes/${encodeURIComponent(episode.id)}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border-2 border-[#112B4F]/10 hover:border-[#FAA21B] block"
    >
      <div className="relative overflow-hidden">
        <img
          src={episode.imageUrl}
          alt={episode.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112B4F]/30 via-[#112B4F]/0 to-[#112B4F]/0" />
        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FAA21B] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform duration-200 shadow-lg"
        >
          <Play className="h-7 w-7 text-[#112B4F] ml-1" />
        </button>
        {/* <button
          onClick={(e) => { e.preventDefault(); setCurrentEpisode(episode) }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FAA21B] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform duration-200 shadow-lg"
        >
          <Play className="h-7 w-7 text-[#112B4F] ml-1" />
        </button> */}
      </div>

      <div className="p-5 flex flex-col h-[12rem]">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-[#112B4F] group-hover:text-[#FAA21B] transition-colors">
          {episode.title}
        </h3>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {episode.description.replace(/<[^>]*>/g, '')}
        </p>

        <div className="flex items-center gap-4 mt-auto text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[#FAA21B]" />
            <span className="font-medium text-[#112B4F]">{episode.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
