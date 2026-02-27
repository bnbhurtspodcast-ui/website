'use client'

import { motion } from 'motion/react'

const platforms = [
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/back-n-body-hurts/id1722381103' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/7Evzpy1MHgZR8Yy9xDuxXY' },
  { label: 'YouTube', href: 'https://www.youtube.com/@BnBHurtsPodcast/featured' },
]

export function SubscribeSection() {
  return (
    <section
      id="subscribe"
      className="py-20"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(250,162,27,0.05) 50%, transparent 100%)',
        borderTop: '1px solid rgba(250,162,27,0.15)',
        borderBottom: '1px solid rgba(250,162,27,0.15)',
      }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-black uppercase mb-4"
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            color: 'white',
            textShadow: '0 0 40px rgba(250,162,27,0.25)',
          }}
        >
          Never Miss an Episode
        </motion.h2>
        <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Subscribe to Back n&apos; Body Hurts on your favourite platform
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {platforms.map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full font-bold transition-all"
              style={{ backgroundColor: '#FAA21B', color: '#112B4F' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(250,162,27,0.6)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {label}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
