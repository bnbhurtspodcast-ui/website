'use client'

import Link from 'next/link'
import { Play, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { WaveformDecoration } from '@/components/WaveformDecoration'

export function HeroHero() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: 'calc(100dvh - 80px)',
        background: 'linear-gradient(135deg, #0a1628 0%, #112B4F 55%, #0d2240 80%, #0a1628 100%)',
      }}
    >
      {/* Ambient amber glow orb */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250,162,27,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'ambient-pulse 6s ease-in-out infinite',
        }}
      />

      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          backgroundImage:
            'linear-gradient(rgba(250,162,27,1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,162,27,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Waveform bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-0 pointer-events-none" aria-hidden="true">
        <WaveformDecoration barCount={48} color="#FAA21B" className="opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-32 pb-24 md:pb-32 w-full">
        <div className="text-center">

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(250,162,27,0.35) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                  transform: 'scale(1.5)',
                }}
              />
              <img
                src="/logo.png"
                alt="Back n' Body Hurts Podcast"
                className="w-32 h-32 sm:w-44 sm:h-44 md:w-60 md:h-60 relative z-10 drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{
              backgroundColor: 'rgba(250,162,27,0.08)',
              borderColor: 'rgba(250,162,27,0.4)',
              color: '#FAA21B',
            }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            New episodes every two weeks
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
            className="font-black uppercase leading-none mb-4 tracking-tight"
            style={{
              fontFamily: 'var(--font-barlow), Impact, sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            }}
          >
            <span className="text-white block">Back n&apos; Body</span>
            <span
              className="block"
              style={{
                color: '#FAA21B',
                textShadow: '0 0 50px rgba(250,162,27,0.55), 0 0 100px rgba(250,162,27,0.2)',
              }}
            >
              Hurts
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Opinionated guidance for all involved in the rave scene — from the host to the attendees
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/episodes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all"
                style={{ backgroundColor: '#FAA21B', color: '#112B4F' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 28px rgba(250,162,27,0.65), 0 4px 20px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <Play className="h-5 w-5" />
                Listen Now
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://www.youtube.com/@BnBHurtsPodcast/featured"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border transition-all"
                style={{
                  backgroundColor: 'rgba(250,162,27,0.07)',
                  borderColor: 'rgba(250,162,27,0.45)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,162,27,0.85)'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(250,162,27,0.12)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,162,27,0.45)'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(250,162,27,0.07)'
                }}
              >
                Subscribe Free
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
