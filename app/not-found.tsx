import Link from 'next/link'
import Image from 'next/image'

const WAVEFORM_BARS = 48

// Heights for a "mostly flat with occasional spikes" look
const BAR_HEIGHTS = [
  8, 6, 10, 6, 8, 20, 6, 8, 6, 10, 6, 8, 6, 36, 6, 8, 6, 10, 8, 6,
  8, 6, 10, 6, 8, 6, 42, 6, 8, 6, 10, 6, 8, 6, 24, 6, 8, 10, 6, 8,
  6, 10, 8, 6, 8, 6, 10, 6,
]

const PULSE_CLASSES = [
  'animate-[rave-pulse_1.4s_ease-in-out_infinite]',
  'animate-[rave-pulse-2_1.1s_ease-in-out_infinite]',
  'animate-[rave-pulse-3_1.7s_ease-in-out_infinite]',
]

export default function NotFound() {
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
        {/* Ambient gold glow orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(250,162,27,0.10) 0%, transparent 70%)',
            animation: 'ambient-pulse 4s ease-in-out infinite',
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
              style={{ background: 'radial-gradient(circle, rgba(250,162,27,0.35) 0%, transparent 70%)' }}
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

          {/* Signal Lost badge */}
          <p
            className="mb-4 text-xs font-bold tracking-[0.3em] uppercase"
            style={{ color: '#FAA21B', fontFamily: 'var(--font-barlow)' }}
          >
            Signal&nbsp;Lost
          </p>

          {/* 404 heading */}
          <h1
            className="font-black uppercase leading-none mb-4"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 'clamp(5rem, 20vw, 10rem)',
              color: '#FAA21B',
              textShadow: '0 0 60px rgba(250,162,27,0.35), 0 0 120px rgba(250,162,27,0.12)',
              textWrap: 'balance',
              animation: 'glitch-flicker 6s steps(1) infinite',
            }}
          >
            404
          </h1>

          {/* Sub-heading */}
          <h2
            className="text-xl font-semibold uppercase tracking-widest text-white/80 mb-4"
            style={{ fontFamily: 'var(--font-barlow)', textWrap: 'balance' }}
          >
            Page&nbsp;Not&nbsp;Found
          </h2>

          {/* Body copy */}
          <p
            className="text-white/55 mb-10 leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            This page dropped off the lineup. Maybe it got pulled before the set, or it never made it to the stage.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="rave-btn inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm focus-visible:ring-2 focus-visible:ring-[#FAA21B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Back to Home
            </Link>
            <Link
              href="/episodes"
              className="rave-btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm focus-visible:ring-2 focus-visible:ring-[#FAA21B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              Browse Episodes
            </Link>
          </div>
        </main>

        {/* Waveform decoration — bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] px-4 pb-0 opacity-25"
          style={{ height: '80px' }}
        >
          {Array.from({ length: WAVEFORM_BARS }).map((_, i) => {
            const h = BAR_HEIGHTS[i % BAR_HEIGHTS.length]
            const pulseClass = PULSE_CLASSES[i % PULSE_CLASSES.length]
            const delay = `${(i * 0.042).toFixed(2)}s`
            return (
              <div
                key={i}
                className={`w-[3px] rounded-t-sm origin-bottom ${pulseClass}`}
                style={{
                  height: `${h}px`,
                  backgroundColor: '#FAA21B',
                  animationDelay: delay,
                  animationPlayState: 'running',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Glitch flicker + reduced-motion overrides */}
      <style>{`
        @keyframes glitch-flicker {
          0%, 91%, 93%, 95%, 97%, 100% { opacity: 1; }
          92%, 94%, 96%                { opacity: 0.85; filter: blur(0.5px) brightness(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  )
}
