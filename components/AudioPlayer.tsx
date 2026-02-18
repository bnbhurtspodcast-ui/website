'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useAudioPlayer } from './AudioPlayerContext'

export function AudioPlayer() {
  const { currentEpisode: episode } = useAudioPlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (episode) {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [episode])

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

  if (!episode) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#112B4F] border-t border-[#FAA21B]/30 shadow-lg">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Episode Info */}
          <div className="hidden sm:flex items-center gap-3 min-w-0 flex-1">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-sm truncate text-white">{episode.title}</h4>
              <p className="text-xs text-[#FAA21B]">{episode.duration}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={skipBackward}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-3 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-[#112B4F]" />
                ) : (
                  <Play className="h-6 w-6 text-[#112B4F] ml-0.5" />
                )}
              </button>
              <button
                onClick={skipForward}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-white/70 min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FAA21B]"
              />
              <span className="text-xs text-white/70 min-w-[40px] text-right">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="h-5 w-5 text-white/70" />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FAA21B]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
