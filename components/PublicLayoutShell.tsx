'use client'

import { AudioPlayerProvider } from '@/components/AudioPlayerContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AudioPlayer } from '@/components/AudioPlayer'
import { AudioPlayerSpacer } from '@/components/AudioPlayerSpacer'
import { PageTransition } from '@/components/PageTransition'

export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <AudioPlayerProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: '#0a1628',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(250,162,27,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(17,43,79,0.8) 0%, transparent 60%),
            linear-gradient(180deg, #0a1628 0%, #112B4F 40%, #0d2240 70%, #0a1628 100%)
          `,
        }}
      >
        {/* Scanline texture overlay — purely decorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
            backgroundSize: '100% 4px',
          }}
        />

        <Header />
        <main className="flex-1 relative z-10">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <AudioPlayerSpacer />
        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  )
}
