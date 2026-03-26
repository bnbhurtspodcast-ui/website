'use client'

import { useState, useTransition } from 'react'
import { X, MapPin, Clock, Users, ExternalLink, Music, Pencil, Star } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { CalendarEvent, EventReview, EventType } from '@/types'
import { updateEvent, deleteEventReview } from '@/app/(admin)/admin/calendar/actions'
import { updateEventHosts } from '@/app/(admin)/admin/hosts/actions'
import { EVENT_TYPE_COLORS, resolveEventType } from '@/app/(admin)/admin/calendar/eventTypeColors'
import { StarRating } from '@/app/(admin)/admin/calendar/StarRating'
import { EventReviewForm } from '@/app/(admin)/admin/calendar/EventReviewForm'

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  event: 'Event',
  festival: 'Festival',
  livestream: 'Livestream',
  social_post: 'Social Post',
  recording_session: 'Recording Session',
}

const REVIEWABLE_TYPES: EventType[] = ['event', 'festival', 'livestream']

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60 transition-colors',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'event', label: 'Event' },
  { value: 'festival', label: 'Festival' },
  { value: 'livestream', label: 'Livestream' },
  { value: 'social_post', label: 'Social Post' },
  { value: 'recording_session', label: 'Recording Session' },
]

export function EventDetailModal({
  event,
  onClose,
  hosts,
  reviews,
  currentUserId,
  onEventUpdate,
}: {
  event: CalendarEvent | null
  onClose: () => void
  hosts: { id: string; name: string }[]
  reviews: EventReview[]
  currentUserId: string | null
  onEventUpdate: (updated: Partial<CalendarEvent> & { id: string }) => void
}) {
  const [editingHosts, setEditingHosts] = useState(false)
  const [localHosts, setLocalHosts] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<CalendarEvent>>({})
  const [editError, setEditError] = useState<string | null>(null)

  const [showReviewForm, setShowReviewForm] = useState(false)

  if (!event) return null

  const effectiveType = resolveEventType(event)
  const colors = EVENT_TYPE_COLORS[effectiveType]
  const isReviewable = REVIEWABLE_TYPES.includes(effectiveType)
  const isManualEvent = !event.edmtrain_id
  const myReview = reviews.find((r) => r.reviewer_id === currentUserId)

  const formattedDate = format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy')
  const timeRange = [event.start_time?.slice(0, 5), event.end_time?.slice(0, 5)]
    .filter(Boolean)
    .join(' – ') || null

  const displayHosts = localHosts.length > 0 ? localHosts : event.hosts
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
      onEventUpdate({ id: event!.id, hosts: localHosts })
      setEditingHosts(false)
    })
  }

  function openEdit() {
    const e = event!
    setEditForm({
      name: e.name,
      event_type: resolveEventType(e),
      event_date: e.event_date,
      start_time: e.start_time ?? '',
      end_time: e.end_time ?? '',
      venue_name: e.venue_name ?? '',
      venue_location: e.venue_location ?? '',
      venue_address: e.venue_address ?? '',
      description: e.description ?? '',
      link: e.link ?? '',
      ages: e.ages ?? '',
      notes: e.notes ?? '',
    })
    setEditError(null)
    setIsEditing(true)
  }

  function patchEdit(updates: Partial<CalendarEvent>) {
    setEditForm((f) => ({ ...f, ...updates }))
  }

  function handleEditSave() {
    if (!editForm.name?.trim() || !editForm.event_date) return
    startTransition(async () => {
      const result = await updateEvent(event!.id, {
        name: editForm.name!.trim(),
        event_type: editForm.event_type as EventType,
        event_date: editForm.event_date!,
        start_time: (editForm.start_time as string) || null,
        end_time: (editForm.end_time as string) || null,
        venue_name: (editForm.venue_name as string) || null,
        venue_location: (editForm.venue_location as string) || null,
        venue_address: (editForm.venue_address as string) || null,
        description: (editForm.description as string) || null,
        link: (editForm.link as string) || null,
        ages: (editForm.ages as string) || null,
        notes: (editForm.notes as string) || null,
      })
      if (result.error) {
        setEditError(result.error)
      } else {
        onEventUpdate({ id: event!.id, ...editForm })
        setIsEditing(false)
      }
    })
  }

  function handleDeleteReview(reviewId: string) {
    startTransition(async () => {
      await deleteEventReview(reviewId, event!.id)
    })
  }

  function calcScore(r: EventReview) {
    return ((r.sound + r.production + r.vibes + r.venue + r.journey) / 5).toFixed(2)
  }

  function getInitials(name?: string) {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
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
              <span className={`admin-badge ${colors.badge}`}>
                {EVENT_TYPE_LABELS[effectiveType]}
              </span>
              {event.reviewed && isReviewable && (
                <span className="admin-badge bg-green-500/15 text-green-300 border border-green-500/30 flex items-center gap-1">
                  <Star className="size-2.5 fill-green-400 text-green-400" aria-hidden="true" />
                  Reviewed
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
          <div className="flex items-center gap-1 flex-shrink-0">
            {isManualEvent && !isEditing && (
              <button
                onClick={openEdit}
                aria-label="Edit event"
                className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-[#FAA21B]/30 via-[#FAA21B]/10 to-transparent mb-5" />

        {/* ── Edit Mode ── */}
        {isEditing ? (
          <div className="space-y-4 text-sm">
            <div>
              <label className={labelCls}>Event Name *</label>
              <input
                autoFocus
                type="text"
                value={(editForm.name as string) ?? ''}
                onChange={(e) => patchEdit({ name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Event Type</label>
              <select
                value={(editForm.event_type as string) ?? 'event'}
                onChange={(e) => patchEdit({ event_type: e.target.value as EventType })}
                className={inputCls + ' appearance-none cursor-pointer'}
              >
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a1628]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date *</label>
              <input
                type="date"
                value={(editForm.event_date as string) ?? ''}
                onChange={(e) => patchEdit({ event_date: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start Time</label>
                <input
                  type="time"
                  value={(editForm.start_time as string) ?? ''}
                  onChange={(e) => patchEdit({ start_time: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>End Time</label>
                <input
                  type="time"
                  value={(editForm.end_time as string) ?? ''}
                  onChange={(e) => patchEdit({ end_time: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Venue Name</label>
              <input type="text" value={(editForm.venue_name as string) ?? ''} onChange={(e) => patchEdit({ venue_name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Venue Location</label>
              <input type="text" value={(editForm.venue_location as string) ?? ''} onChange={(e) => patchEdit({ venue_location: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Venue Address</label>
              <input type="text" value={(editForm.venue_address as string) ?? ''} onChange={(e) => patchEdit({ venue_address: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={3} value={(editForm.description as string) ?? ''} onChange={(e) => patchEdit({ description: e.target.value })} className={inputCls + ' resize-none'} />
            </div>
            <div>
              <label className={labelCls}>Event URL</label>
              <input type="url" value={(editForm.link as string) ?? ''} onChange={(e) => patchEdit({ link: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ages</label>
              <input type="text" value={(editForm.ages as string) ?? ''} onChange={(e) => patchEdit({ ages: e.target.value })} placeholder="e.g. 19+" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Hosts Attending</label>
              <div className="space-y-0.5 max-h-40 overflow-y-auto">
                {hosts.map((h) => {
                  const currentHosts = (editForm.hosts ?? event.hosts) as string[]
                  return (
                    <label key={h.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={currentHosts.includes(h.id)}
                        onChange={() => {
                          patchEdit({
                            hosts: currentHosts.includes(h.id)
                              ? currentHosts.filter((x) => x !== h.id)
                              : [...currentHosts, h.id],
                          })
                        }}
                        className="accent-[#FAA21B] w-3.5 h-3.5 flex-shrink-0"
                      />
                      <span className="text-sm text-white/75">{h.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={2} value={(editForm.notes as string) ?? ''} onChange={(e) => patchEdit({ notes: e.target.value })} className={inputCls + ' resize-none'} />
            </div>
            {editError && <p className="text-xs text-red-400">{editError}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-2 admin-btn-ghost rounded-lg text-xs font-semibold">Cancel</button>
              <button
                onClick={handleEditSave}
                disabled={!editForm.name?.trim() || !editForm.event_date || isPending}
                className="flex-1 py-2 admin-btn-primary rounded-lg text-xs disabled:opacity-40"
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* ── View Mode ── */
          <div className="space-y-4 text-sm">
            {event.description && (
              <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>
            )}

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
                  {event.edmtrain_id ? 'View on EDMTrain' : 'View Event'}
                </a>
              </div>
            )}

            {/* ── Reviews Section ── */}
            {isReviewable && (
              <div className="pt-4 border-t border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Reviews
                  </span>
                  {reviews.length > 0 && (
                    <span className="text-xs text-white/30">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  )}
                </div>

                {reviews.length === 0 && !showReviewForm && (
                  <p className="text-xs text-white/25">No reviews yet.</p>
                )}

                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl bg-white/5 border border-white/8 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAA21B]/20 border border-[#FAA21B]/30 flex items-center justify-center text-[10px] font-bold text-[#FAA21B]">
                          {getInitials(r.reviewer_name)}
                        </div>
                        <span className="text-sm font-semibold text-white/80">{r.reviewer_name ?? 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#FAA21B]">
                          {calcScore(r)}<span className="text-white/30 font-normal text-xs"> / 5</span>
                        </span>
                        {r.reviewer_id === currentUserId && (
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            disabled={isPending}
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <StarRating label="Sound" value={r.sound} size="sm" />
                      <StarRating label="Production" value={r.production} size="sm" />
                      <StarRating label="Vibes" value={r.vibes} size="sm" />
                      <StarRating label="Venue" value={r.venue} size="sm" />
                      <StarRating label="Journey" value={r.journey} size="sm" />
                    </div>
                    {r.will_go_again && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-300 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                        ✓ Will go again
                      </span>
                    )}
                    {r.description && (
                      <p className="text-xs text-white/50 leading-relaxed">{r.description}</p>
                    )}
                  </div>
                ))}

                {currentUserId && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-2 text-xs font-semibold border border-dashed border-white/15 rounded-lg text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
                  >
                    {myReview ? 'Edit Your Review' : '+ Write a Review'}
                  </button>
                )}

                {showReviewForm && (
                  <EventReviewForm
                    eventId={event.id}
                    existingReview={myReview}
                    onDone={() => setShowReviewForm(false)}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
