'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react'
import type { CalendarEvent, Host } from '@/types'

export interface EventWithHosts extends CalendarEvent {
  attendingHosts: Host[]
}

interface EventGoingSectionProps {
  events: EventWithHosts[]
}

function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTime(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function HostAvatar({ host, size = 'sm' }: { host: Host; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  if (host.photo_url) {
    return (
      <img
        src={host.photo_url}
        alt={host.name}
        title={host.name}
        className={`${dim} rounded-full object-cover ring-2 ring-[#0a1628]`}
      />
    )
  }
  return (
    <div
      title={host.name}
      className={`${dim} rounded-full flex items-center justify-center ring-2 ring-[#0a1628] font-bold ${textSize}`}
      style={{ backgroundColor: 'rgba(250,162,27,0.2)', color: '#FAA21B' }}
    >
      {host.name.charAt(0)}
    </div>
  )
}

function EventCard({ event, onClick }: { event: EventWithHosts; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="rave-card rave-card-lift rounded-2xl p-5 text-left cursor-pointer flex-shrink-0 w-72 md:w-auto flex flex-col"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
    >
      {/* Top badges row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: 'rgba(250,162,27,0.15)', color: '#FAA21B' }}
        >
          <Calendar className="h-3 w-3" />
          {formatEventDate(event.event_date)}
        </span>
        {event.festival_ind && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: 'rgba(168,85,247,0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168,85,247,0.35)',
            }}
          >
            Festival
          </span>
        )}
        {event.livestream_ind && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: 'rgba(59,130,246,0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.35)',
            }}
          >
            Livestream
          </span>
        )}
      </div>

      {/* Event name */}
      <h3
        className="font-black uppercase leading-tight mb-3 line-clamp-2"
        style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          color: 'white',
          fontSize: '1.1rem',
        }}
      >
        {event.name}
      </h3>

      {/* Venue */}
      {event.venue_name && (
        <div className="flex items-start gap-1.5 text-sm mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: '#FAA21B' }} />
          <span className="line-clamp-1">{event.venue_name}</span>
        </div>
      )}
      {event.venue_location && (
        <p className="text-xs mb-2 ml-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {event.venue_location}
        </p>
      )}

      {/* Start time */}
      {event.start_time && (
        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Clock className="h-3 w-3" style={{ color: '#FAA21B' }} />
          {formatTime(event.start_time)}
        </div>
      )}

      {/* Host avatars */}
      {event.attendingHosts.length > 0 && (
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex -space-x-2">
            {event.attendingHosts.map((host) => (
              <HostAvatar key={host.id} host={host} size="sm" />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {event.attendingHosts.length === 1
              ? `${event.attendingHosts[0].name} is going`
              : `${event.attendingHosts.length} hosts going`}
          </span>
        </div>
      )}
    </motion.button>
  )
}

function EventModal({ event, onClose }: { event: EventWithHosts; onClose: () => void }) {
  const startFmt = formatTime(event.start_time)
  const endFmt = formatTime(event.end_time)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rave-panel rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {event.festival_ind && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.35)' }}
                >
                  Festival
                </span>
              )}
              {event.livestream_ind && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.35)' }}
                >
                  Livestream
                </span>
              )}
            </div>
            <h2
              className="font-black uppercase leading-tight text-white"
              style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: '1.5rem' }}
            >
              {event.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.background = 'rgba(250,162,27,0.15)' }}
            onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Date + Time */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#FAA21B' }} />
              {formatEventDate(event.event_date)}
            </div>
            {startFmt && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#FAA21B' }} />
                {startFmt}{endFmt ? ` – ${endFmt}` : ''}
              </div>
            )}
          </div>

          {/* Venue */}
          {(event.venue_name || event.venue_location) && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: 'rgba(250,162,27,0.6)' }}>
                Venue
              </p>
              {event.venue_name && <p className="font-bold text-white">{event.venue_name}</p>}
              {event.venue_location && (
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{event.venue_location}</p>
              )}
              {event.venue_address && (
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{event.venue_address}</p>
              )}
            </div>
          )}

          {/* Ages */}
          {event.ages && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: 'rgba(250,162,27,0.6)' }}>
                Ages
              </p>
              <p className="text-sm text-white">{event.ages}</p>
            </div>
          )}

          {/* Artists */}
          {event.artists && event.artists.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: 'rgba(250,162,27,0.6)' }}>
                Artists
              </p>
              <div className="flex flex-wrap gap-2">
                {event.artists.map((artist) =>
                  artist.link ? (
                    <a
                      key={artist.id}
                      href={artist.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                      style={{
                        background: 'rgba(250,162,27,0.1)',
                        border: '1px solid rgba(250,162,27,0.3)',
                        color: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      {artist.name}{artist.b2b_ind ? ' (b2b)' : ''}
                    </a>
                  ) : (
                    <span
                      key={artist.id}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {artist.name}{artist.b2b_ind ? ' (b2b)' : ''}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Hosts attending */}
          {event.attendingHosts.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: 'rgba(250,162,27,0.6)' }}>
                Hosts Attending
              </p>
              <div className="flex flex-wrap gap-3">
                {event.attendingHosts.map((host) => (
                  <div key={host.id} className="flex items-center gap-2.5">
                    <HostAvatar host={host} size="md" />
                    <span className="text-sm font-medium text-white">{host.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.5)' }}>{event.notes}</p>
          )}

          {/* CTA */}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rave-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold w-full justify-center"
            >
              <Image src="/edmtrainLogo.svg" alt="" width={16} height={16} />
              View on EDMTRAIN
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {/* Attribution */}
          <div className="flex items-center justify-center gap-2 opacity-40">
            <span className="text-xs text-white/60">Event data provided by</span>
            <a
              href="https://edmtrain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:opacity-100 transition-opacity"
            >
              <Image src="/edmtrainLogo.svg" alt="EDMTRAIN" width={14} height={14} />
              <span className="text-xs font-bold" style={{ color: '#ee008e' }}>EDMTRAIN</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function EventGoingSection({ events }: EventGoingSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventWithHosts | null>(null)

  if (events.length === 0) return null

  return (
    <>
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(250,162,27,0.05) 50%, transparent 100%)',
          borderTop: '1px solid rgba(250,162,27,0.15)',
          borderBottom: '1px solid rgba(250,162,27,0.15)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="font-black uppercase leading-none tracking-tight mb-3"
              style={{
                fontFamily: 'var(--font-barlow), sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                color: 'white',
                textShadow: '0 0 40px rgba(250,162,27,0.25)',
              }}
            >
              Where We&apos;re At
            </h2>
            <a
              href="https://edmtrain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity opacity-60 hover:opacity-100"
            >
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Powered by</span>
              <Image src="/edmtrainLogo.svg" alt="EDMTRAIN" width={16} height={16} />
              <span className="font-bold" style={{ color: '#ee008e' }}>EDMTRAIN</span>
            </a>
          </motion.div>

          {/* Cards — horizontal scroll on mobile, grid on md+ */}
          <motion.div
            className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
