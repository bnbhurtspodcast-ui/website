'use client'

import { AudioPlayerProvider } from '@/components/AudioPlayerContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AudioPlayer } from '@/components/AudioPlayer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#112B4F] via-[#1a3d5f] to-[#112B4F] flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  )
}
