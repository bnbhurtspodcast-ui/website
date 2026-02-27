'use client'

import { useAudioPlayer } from '@/components/AudioPlayerContext'

// Pushes page content up by the player height when the player is open,
// so the footer is never hidden behind the fixed bottom bar.
export function AudioPlayerSpacer() {
  const { currentEpisode } = useAudioPlayer()
  if (!currentEpisode) return null
  // ~100px covers the player bar height + mobile episode-info row + safe-area
  return <div aria-hidden="true" style={{ height: '100px' }} />
}
