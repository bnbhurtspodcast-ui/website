'use client'

import { useEffect } from 'react'
import { useAudioPlayer } from '@/components/AudioPlayerContext'
import type { Episode } from '@/types'

interface EpisodesRegistrarProps {
  episodes: Episode[]
}

export function EpisodesRegistrar({ episodes }: EpisodesRegistrarProps) {
  const { setEpisodes } = useAudioPlayer()

  useEffect(() => {
    setEpisodes(episodes)
  }, [episodes, setEpisodes])

  return null
}
