'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Episode } from '@/types'

interface AudioPlayerContextValue {
  currentEpisode: Episode | null
  episodes: Episode[]
  setCurrentEpisode: (episode: Episode) => void
  setEpisodes: (episodes: Episode[]) => void
  closePlayer: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>({
  currentEpisode: null,
  episodes: [],
  setCurrentEpisode: () => {},
  setEpisodes: () => {},
  closePlayer: () => {},
})

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])

  const closePlayer = () => setCurrentEpisode(null)

  return (
    <AudioPlayerContext.Provider
      value={{ currentEpisode, episodes, setCurrentEpisode, setEpisodes, closePlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext)
}
