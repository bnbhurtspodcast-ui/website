'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  X,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { useAudioPlayer } from '@/components/AudioPlayerContext'

export function AudioPlayer() {
  const { currentEpisode: episode, episodes, setCurrentEpisode, closePlayer } = useAudioPlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (episode) {
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [episode])

  const currentIndex = episode ? episodes.findIndex((ep) => ep.id === episode.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex !== -1 && currentIndex < episodes.length - 1

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value)
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol / 100
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 15
      )
    }
  }

  const goToPrev = () => {
    if (hasPrev) {
      setCurrentEpisode(episodes[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (hasNext) {
      setCurrentEpisode(episodes[currentIndex + 1])
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!episode) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#112B4F] border-t border-[#FAA21B]/30 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', width: '100vw', maxWidth: '100vw' }}
    >
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          if (hasNext) goToNext()
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-3 overflow-hidden">
        {/* Mobile: episode info row */}
        <div className="flex sm:hidden items-center gap-2 mb-2 min-w-0 w-full overflow-hidden">
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="h-8 w-8 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <Link
              href={`/episodes/${encodeURIComponent(episode.id)}`}
              className="block font-medium text-xs text-white truncate hover:text-[#FAA21B] transition-colors"
            >
              {episode.title}
            </Link>
            <p className="text-[10px] text-[#FAA21B]">{episode.duration}</p>
          </div>
          <button
            onClick={closePlayer}
            aria-label="Close player"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main row: episode info | controls | volume+close */}
        <div className="flex items-center gap-3 w-full overflow-hidden">
          {/* Episode Info — desktop only */}
          <div className="hidden sm:flex items-center gap-3 min-w-0 w-[240px] flex-shrink-0">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <Link
                href={`/episodes/${encodeURIComponent(episode.id)}`}
                className="block font-medium text-sm text-white truncate hover:text-[#FAA21B] transition-colors"
              >
                {episode.title}
              </Link>
              <p className="text-xs text-[#FAA21B]">{episode.duration}</p>
            </div>
          </div>

          {/* Controls — center */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0 overflow-hidden">
            {/* Playback buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Prev episode */}
              <button
                onClick={goToPrev}
                disabled={!hasPrev}
                aria-label="Previous episode"
                className={`p-1.5 rounded-full transition-colors ${
                  hasPrev
                    ? 'hover:bg-white/10 text-white'
                    : 'text-white/20 cursor-not-allowed'
                }`}
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Skip back 15s */}
              <button
                onClick={skipBackward}
                aria-label="Skip back 15 seconds"
                className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <RotateCcw className="h-5 w-5" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white leading-none mt-0.5">
                  15
                </span>
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-3 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-[#112B4F]" />
                ) : (
                  <Play className="h-5 w-5 text-[#112B4F] ml-0.5" />
                )}
              </button>

              {/* Skip forward 15s */}
              <button
                onClick={skipForward}
                aria-label="Skip forward 15 seconds"
                className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <RotateCw className="h-5 w-5" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white leading-none mt-0.5">
                  15
                </span>
              </button>

              {/* Next episode */}
              <button
                onClick={goToNext}
                disabled={!hasNext}
                aria-label="Next episode"
                className={`p-1.5 rounded-full transition-colors ${
                  hasNext
                    ? 'hover:bg-white/10 text-white'
                    : 'text-white/20 cursor-not-allowed'
                }`}
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-white/60 min-w-[36px] tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 h-1 group">
                <div className="absolute inset-0 rounded-full bg-white/20" />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#FAA21B]"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  aria-label="Seek"
                />
              </div>
              <span className="text-xs text-white/60 min-w-[36px] text-right tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume + Close — desktop only */}
          <div className="hidden sm:flex items-center gap-2 w-[240px] flex-shrink-0 justify-end">
            <Volume2 className="h-4 w-4 text-white/50 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FAA21B]"
              aria-label="Volume"
            />
            <button
              onClick={closePlayer}
              aria-label="Close player"
              className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
