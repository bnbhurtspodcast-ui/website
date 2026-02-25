'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const WAVEFORM_BARS = 48

// Fully flat waveform — signal dead
const BAR_HEIGHTS = Array.from({ length: WAVEFORM_BARS }, (_, i) =>
  i % 12 === 0 ? 8 : 5
)

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[BNB Error Boundary]', error)
  }, [error])

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded rave-btn font-bold"
      >
        Skip to main content
      </a>

      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #112B4F 55%, #0d2240 80%, #0a1628 100%)' }}
      >
        {/* Ambient red-tinted glow orb (error = red, not gold) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,24,61,0.12) 0%, rgba(250,162,27,0.05) 60%, transparent 80%)',
          }}
        />

        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Scanline texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
            animation: 'scanline-drift 8s linear infinite',
          }}
        />

        {/* Main content */}
        <main
          id="main-content"
          className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-2xl mx-auto"
        >
          {/* Logo */}
          <div className="mb-8 relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(212,24,61,0.25) 0%, transparent 70%)' }}
            />
            <Image
              src="/logo.png"
              alt="Back n' Body Hurts Podcast logo"
              width={72}
              height={72}
              priority
              className="relative rounded-full drop-shadow-2xl"
            />
          </div>

          {/* Error badge */}
          <p
            className="mb-4 text-xs font-bold tracking-[0.3em] uppercase"
            style={{ color: '#d4183d', fontFamily: 'var(--font-barlow)' }}
          >
            Error
          </p>

          {/* Main heading */}
          <h1
            className="font-black uppercase leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              color: 'white',
              textShadow: '0 0 40px rgba(212,24,61,0.2)',
              textWrap: 'balance',
            }}
          >
            Something Went&nbsp;Wrong
          </h1>

          {/* Body copy */}
          <p
            className="text-white/55 mb-10 leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
            role="status"
          >
            An unexpected error occurred. The set got cut short — but the show must go on.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={reset}
              className="rave-btn inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FAA21B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rave-btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm focus-visible:ring-2 focus-visible:ring-[#FAA21B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Back to Home
            </Link>
          </div>
        </main>

        {/* Flat waveform decoration — signal dead */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] px-4 pb-0 opacity-20"
          style={{ height: '80px' }}
        >
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-t-sm"
              style={{
                height: `${h}px`,
                backgroundColor: '#d4183d',
              }}
            />
          ))}
        </div>
      </div>

      {/* Reduced-motion override */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  )
}
