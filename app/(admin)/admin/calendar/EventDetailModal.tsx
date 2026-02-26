'use client'

import { useState, useTransition } from 'react'
import { X, MapPin, Clock, Users, ExternalLink, Music } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { CalendarEvent } from '@/types'
import { updateEventHosts } from '../actions'

export function EventDetailModal({
  event,
  onClose,
  hosts,
}: {
  event: CalendarEvent | null
  onClose: () => void
  hosts: { id: string; name: string }[]
}) {
  const [editingHosts, setEditingHosts] = useState(false)
  const [localHosts, setLocalHosts] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  if (!event) return null

  const formattedDate = format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy')
  const timeRange = [event.start_time?.slice(0, 5), event.end_time?.slice(0, 5)]
    .filter(Boolean)
    .join(' – ') || null

  const displayHosts = localHosts.length > 0 ? localHosts : event.hosts

  // Map host id → name for display
  const hostMap = new Map(hosts.map((h) => [h.id, h.name]))

  function openHostEdit() {
    setLocalHosts(displayHosts)
    setEditingHosts(true)
  }

  function toggleHost(id: string) {
    setLocalHosts((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    )
  }

  function handleHostsSave() {
    startTransition(async () => {
      await updateEventHosts(event!.id, localHosts)
      setEditingHosts(false)
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="admin-modal p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {event.festival_ind && (
                <span className="admin-badge bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Festival
                </span>
              )}
              {event.livestream_ind && (
                <span className="admin-badge bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  Livestream
                </span>
              )}
              {event.ages && (
                <span className="admin-badge bg-white/8 text-white/50 border border-white/12">
                  {event.ages}
                </span>
              )}
            </div>
            <h2
              id="event-modal-title"
              className="text-xl font-bold text-white leading-snug"
            >
              {event.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-[#FAA21B]/30 via-[#FAA21B]/10 to-transparent mb-5" />

        <div className="space-y-4 text-sm">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Clock className="size-4 text-[#FAA21B]/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-white/80">{formattedDate}</p>
              {timeRange && (
                <p className="text-white/45 text-xs mt-0.5">{timeRange}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          {event.venue_name && (
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-[#FAA21B]/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-white/80">{event.venue_name}</p>
                {event.venue_location && (
                  <p className="text-white/45 text-xs mt-0.5">{event.venue_location}</p>
                )}
                {event.venue_address && (
                  <p className="text-white/35 text-xs">{event.venue_address}</p>
                )}
              </div>
            </div>
          )}

          {/* Artists */}
          {event.artists?.length > 0 && (
            <div className="flex items-start gap-3">
              <Music className="size-4 text-[#FAA21B]/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-wrap gap-1.5">
                {event.artists.map((a) => (
                  <span
                    key={a.id}
                    className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 text-white/60 rounded-full"
                  >
                    {a.b2b_ind ? 'b2b ' : ''}{a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hosts */}
          <div className="flex items-start gap-3">
            <Users className="size-4 text-[#FAA21B]/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Hosts
                </span>
                {!editingHosts && (
                  <button
                    onClick={openHostEdit}
                    className="text-xs text-[#FAA21B]/70 hover:text-[#FAA21B] transition-colors"
                  >
                    {displayHosts.length > 0 ? 'Edit' : 'Assign'}
                  </button>
                )}
              </div>
              {editingHosts ? (
                <div className="space-y-2">
                  {hosts.length > 0 ? (
                    <div className="space-y-0.5 max-h-40 overflow-y-auto">
                      {hosts.map((h) => (
                        <label
                          key={h.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={localHosts.includes(h.id)}
                            onChange={() => toggleHost(h.id)}
                            className="accent-[#FAA21B] w-3.5 h-3.5 flex-shrink-0"
                          />
                          <span className="text-sm text-white/75">{h.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/30 text-xs px-2">No hosts in the system yet.</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingHosts(false)}
                      className="flex-1 py-1.5 admin-btn-ghost rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleHostsSave}
                      disabled={isPending}
                      className="flex-1 py-1.5 admin-btn-primary rounded-lg text-xs disabled:opacity-50"
                    >
                      {isPending ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : displayHosts.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {displayHosts.map((hostId) => (
                    <span
                      key={hostId}
                      className="px-2.5 py-1 text-xs bg-[#FAA21B]/10 border border-[#FAA21B]/25 text-[#FAA21B]/80 rounded-full"
                    >
                      {hostMap.get(hostId) ?? hostId}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-xs">No hosts assigned</p>
              )}
            </div>
          </div>

          {/* External link */}
          {event.link && (
            <div className="pt-1">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FAA21B]/70 hover:text-[#FAA21B] text-xs font-semibold transition-colors"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                View on EDMTrain
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
