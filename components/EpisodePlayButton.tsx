'use client'

import { Play } from 'lucide-react'
import { useAudioPlayer } from './AudioPlayerContext'
import type { Episode } from '@/types'

export function EpisodePlayButton({ episode }: { episode: Episode }) {
  const { setCurrentEpisode } = useAudioPlayer()

  return (
    <button
      onClick={() => setCurrentEpisode(episode)}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg"
    >
      <Play className="h-5 w-5 ml-0.5" />
      Play Audio
    </button>
  )
}
