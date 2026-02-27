'use client'

import { Mic2, MapPin, CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'

interface StatsBarProps {
  episodeCount: number
}

export function StatsBar({ episodeCount }: StatsBarProps) {
  const stats = [
    { value: episodeCount.toString(), label: 'Episodes Published', icon: Mic2 },
    { value: 'Toronto', label: 'EDM Community Hub', icon: MapPin },
    { value: 'Bi-Weekly', label: 'Fresh Episodes', icon: CalendarDays },
  ]

  return (
    <section
      className="py-14 border-y"
      style={{
        borderColor: 'rgba(250,162,27,0.15)',
        background: 'rgba(10,22,40,0.7)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center px-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
              }}
            >
              <div className="flex justify-center mb-3" aria-hidden="true">
                <stat.icon size={32} color="#FAA21B" strokeWidth={1.5} />
              </div>
              <div
                className="font-black mb-1"
                style={{
                  fontFamily: 'var(--font-barlow), sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'white',
                }}
              >
                {stat.value}
              </div>
              <div
                className="font-medium text-sm uppercase tracking-widest"
                style={{ color: 'rgba(250,162,27,0.8)' }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
