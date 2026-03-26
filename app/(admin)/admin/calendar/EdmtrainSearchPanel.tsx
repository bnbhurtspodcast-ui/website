'use client'

import { useState, useTransition, useRef, useEffect, useMemo } from 'react'
import {
  searchEdmtrainLocations,
  searchEdmtrainByLocationId,
} from '@/app/(admin)/admin/calendar/actions'
import type { EdmtrainEvent, EdmtrainLocationSuggestion } from '@/types'

type FormPatch = {
  name?: string
  event_date?: string
  venue_name?: string
  venue_location?: string
  venue_address?: string
  ages?: string
  link?: string
  edmtrain_id?: number | null
}

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60 transition-colors',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

function buildDisplayName(e: EdmtrainEvent): string {
  const artists = e.artistList?.map((a) => a.name).join(', ') ?? ''
  if (e.name && artists) return `${e.name} — ${artists}`
  return e.name ?? artists ?? 'Untitled Event'
}

function buildFillName(e: EdmtrainEvent): string {
  const artists = e.artistList?.map((a) => a.name).join(', ') ?? ''
  if (e.name && artists) return `${e.name} - ${artists}`
  return e.name ?? artists ?? 'Untitled Event'
}

export function EdmtrainSearchPanel({ onSelect }: { onSelect: (patch: FormPatch) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  // Step 1: city autocomplete
  const [cityQuery, setCityQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<EdmtrainLocationSuggestion[]>([])
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [isPendingLocations, startLocationsTransition] = useTransition()

  // Step tracking
  const [cityStep, setCityStep] = useState<1 | 2>(1)
  const [selectedSuggestion, setSelectedSuggestion] = useState<EdmtrainLocationSuggestion | null>(null)

  // All events loaded from API (never changes after load)
  const [allEvents, setAllEvents] = useState<EdmtrainEvent[]>([])
  // Client-side filter query
  const [eventQuery, setEventQuery] = useState('')

  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPendingEvents, startEventsTransition] = useTransition()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Filtered events derived from allEvents + eventQuery
  const filteredEvents = useMemo(() => {
    if (!eventQuery.trim()) return allEvents
    const q = eventQuery.toLowerCase()
    return allEvents.filter((e) => {
      const name = (e.name ?? '').toLowerCase()
      const artists = (e.artistList ?? []).map((a) => a.name.toLowerCase()).join(' ')
      const venue = (e.venue?.name ?? '').toLowerCase()
      return name.includes(q) || artists.includes(q) || venue.includes(q)
    })
  }, [allEvents, eventQuery])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  }, [])

  function resetAll() {
    setCityQuery('')
    setLocationSuggestions([])
    setSelectedSuggestion(null)
    setLocationDropdownOpen(false)
    setCityStep(1)
    setAllEvents([])
    setEventQuery('')
    setHasLoaded(false)
    setError(null)
  }

  function handleClose() {
    resetAll()
    setIsOpen(false)
  }

  // Step 1: debounced city input → location suggestions
  function handleCityInput(value: string) {
    setCityQuery(value)
    setSelectedSuggestion(null)
    setCityStep(1)
    setAllEvents([])
    setHasLoaded(false)
    setError(null)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (value.trim().length < 2) {
      setLocationSuggestions([])
      setLocationDropdownOpen(false)
      return
    }
    debounceTimer.current = setTimeout(() => {
      startLocationsTransition(async () => {
        const result = await searchEdmtrainLocations(value.trim())
        if (result.suggestions && result.suggestions.length > 0) {
          setLocationSuggestions(result.suggestions)
          setLocationDropdownOpen(true)
        } else {
          setLocationSuggestions([])
          setLocationDropdownOpen(false)
        }
      })
    }, 500)
  }

  // Step 1 → Step 2: pick a city, immediately load all events
  function handleLocationSelect(suggestion: EdmtrainLocationSuggestion) {
    setSelectedSuggestion(suggestion)
    setCityQuery(suggestion.value)
    setLocationDropdownOpen(false)
    setCityStep(2)
    setError(null)
    setHasLoaded(false)
    setAllEvents([])
    setEventQuery('')
    startEventsTransition(async () => {
      const result = await searchEdmtrainByLocationId(suggestion.data.locationId)
      setHasLoaded(true)
      if (result.error) setError(result.error)
      else setAllEvents(result.events ?? [])
    })
  }

  // Reset city step back to 1
  function handleChangeCity() {
    setCityStep(1)
    setSelectedSuggestion(null)
    setAllEvents([])
    setHasLoaded(false)
    setError(null)
    setEventQuery('')
  }

  function handleEventSelect(evt: EdmtrainEvent) {
    onSelect({
      name: buildFillName(evt),
      event_date: evt.date,
      venue_name: evt.venue?.name ?? '',
      venue_location: evt.venue?.location ?? '',
      venue_address: evt.venue?.address ?? '',
      ages: evt.ages ?? '',
      link: evt.link ?? '',
      edmtrain_id: evt.id,
    })
    handleClose()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-[11px] font-semibold text-[#FAA21B]/80 hover:text-[#FAA21B] transition-colors py-1"
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Find it on EDMTrain
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          <div className="relative z-10 w-full max-w-lg bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#FAA21B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-sm font-bold text-white">Find on EDMTrain</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Search inputs */}
            <div className="px-5 pt-4 pb-3 flex-shrink-0 space-y-3">
              {cityStep === 1 ? (
                /* Step 1: city autocomplete input */
                <div ref={dropdownRef} className="relative">
                  <label className={labelCls}>City</label>
                  <input
                    autoFocus
                    type="text"
                    value={cityQuery}
                    onChange={(e) => handleCityInput(e.target.value)}
                    placeholder="Type a city name…"
                    className={inputCls}
                    autoComplete="off"
                  />
                  {locationDropdownOpen && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-[#080f1a] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                      {locationSuggestions.map((s) => (
                        <button
                          key={s.data.locationId}
                          type="button"
                          onPointerDown={(e) => { e.preventDefault(); handleLocationSelect(s) }}
                          className="w-full text-left px-3 py-2.5 text-sm text-white/80 hover:bg-white/8 hover:text-white transition-colors"
                        >
                          {s.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {isPendingLocations && (
                    <p className="text-[10px] text-white/30 mt-1.5">Looking up cities…</p>
                  )}
                </div>
              ) : (
                /* Step 2: city pill + event filter */
                <div className="space-y-3">
                  {/* City pill */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAA21B]/8 border border-[#FAA21B]/20">
                      <svg className="w-3.5 h-3.5 text-[#FAA21B]/70 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-sm font-semibold text-[#FAA21B]">{selectedSuggestion?.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleChangeCity}
                      className="px-3 py-2 rounded-lg text-[11px] font-semibold text-white/40 hover:text-white/70 hover:bg-white/8 border border-white/10 transition-all flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  {/* Event filter input */}
                  {hasLoaded && allEvents.length > 0 && (
                    <div>
                      <label className={labelCls}>Filter events</label>
                      <input
                        autoFocus
                        type="text"
                        value={eventQuery}
                        onChange={(e) => setEventQuery(e.target.value)}
                        placeholder="Filter by name, artist, venue…"
                        className={inputCls}
                      />
                      {eventQuery && (
                        <p className="text-[10px] text-white/30 mt-1.5">
                          {filteredEvents.length} of {allEvents.length} events
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            {/* Results list */}
            {(isPendingEvents || (cityStep === 2 && hasLoaded)) && (
              <div className="flex-1 overflow-y-auto border-t border-white/8 min-h-0">
                {isPendingEvents ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-white/30">Loading events…</p>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-white/30">No events found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredEvents.map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => handleEventSelect(evt)}
                        className="w-full text-left px-5 py-3.5 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white/85 group-hover:text-white leading-snug">
                              {buildDisplayName(evt)}
                            </p>
                            <p className="text-[11px] text-white/40 mt-0.5 truncate">
                              {evt.venue?.name}
                              {evt.venue?.location ? ` · ${evt.venue.location}` : ''}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <span className="text-[11px] text-[#FAA21B]/70 font-mono tabular-nums">
                              {evt.date}
                            </span>
                            {evt.ages && (
                              <p className="text-[9px] text-white/30 mt-0.5">{evt.ages}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer hint */}
            {!isPendingEvents && !(cityStep === 2 && hasLoaded) && (
              <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
                <p className="text-[10px] text-white/25 text-center">
                  {cityStep === 1
                    ? 'Type a city name to see matching locations, then select one'
                    : 'Loading events…'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
