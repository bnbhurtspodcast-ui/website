'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Episode } from '@/types'

interface AudioPlayerContextValue {
  currentEpisode: Episode | null
  setCurrentEpisode: (episode: Episode) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>({
  currentEpisode: null,
  setCurrentEpisode: () => {},
})

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  return (
    <AudioPlayerContext.Provider value={{ currentEpisode, setCurrentEpisode }}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext)
}
