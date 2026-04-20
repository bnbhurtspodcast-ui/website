'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Episode } from '@/types'

interface AudioPlayerContextValue {
  currentEpisode: Episode | null
  episodes: Episode[]
  savedTime: number
  setCurrentEpisode: (episode: Episode) => void
  setEpisodes: (episodes: Episode[]) => void
  savePlaybackTime: (time: number) => void
  closePlayer: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>({
  currentEpisode: null,
  episodes: [],
  savedTime: 0,
  setCurrentEpisode: () => {},
  setEpisodes: () => {},
  savePlaybackTime: () => {},
  closePlayer: () => {},
})

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisodeState] = useState<Episode | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [savedTime, setSavedTime] = useState(0)

  // Rehydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const savedEpisode = localStorage.getItem('bnb_current_episode')
      const savedPlaybackTime = localStorage.getItem('bnb_playback_time')
      if (savedEpisode) {
        setCurrentEpisodeState(JSON.parse(savedEpisode) as Episode)
      }
      if (savedPlaybackTime) {
        setSavedTime(parseFloat(savedPlaybackTime))
      }
    } catch {
      // localStorage unavailable or corrupt — start fresh
    }
  }, [])

  const setCurrentEpisode = useCallback((episode: Episode) => {
    setCurrentEpisodeState(episode)
    try {
      localStorage.setItem('bnb_current_episode', JSON.stringify(episode))
    } catch {
      // ignore
    }
  }, [])

  const savePlaybackTime = useCallback((time: number) => {
    setSavedTime(time)
    try {
      localStorage.setItem('bnb_playback_time', String(time))
    } catch {
      // ignore
    }
  }, [])

  const closePlayer = useCallback(() => {
    setCurrentEpisodeState(null)
    setSavedTime(0)
    try {
      localStorage.removeItem('bnb_current_episode')
      localStorage.removeItem('bnb_playback_time')
    } catch {
      // ignore
    }
  }, [])

  return (
    <AudioPlayerContext.Provider
      value={{ currentEpisode, episodes, savedTime, setCurrentEpisode, setEpisodes, savePlaybackTime, closePlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext)
}
