'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, addMonths, subMonths } from 'date-fns'
import { CalendarGrid } from '@/app/(admin)/admin/calendar/CalendarGrid'
import { EventDetailModal } from '@/app/(admin)/admin/calendar/EventDetailModal'
import { CreateEventSheet } from '@/app/(admin)/admin/calendar/CreateEventSheet'
import {
  groupEventsByDate,
  groupSocialPostsByDate,
  groupRecordingTasksByDate,
} from '@/app/(admin)/admin/calendar/calendarUtils'
import { getEventReviews } from '@/app/(admin)/admin/calendar/actions'
import type { CalendarEvent, SocialPost, RecordingSessionTask, EventReview } from '@/types'

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarClient({
  events: initialEvents,
  socialPosts,
  year,
  month,
  hosts,
  recordingTasks,
  currentUserId,
}: {
  events: CalendarEvent[]
  socialPosts: SocialPost[]
  year: number
  month: number
  hosts: { id: string; name: string }[]
  recordingTasks: RecordingSessionTask[]
  currentUserId: string | null
}) {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [reviews, setReviews] = useState<EventReview[]>([])
  const [createSheetOpen, setCreateSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  const currentDate = new Date(year, month, 1)
  const eventsByDate = groupEventsByDate(events)
  const socialPostsByDate = groupSocialPostsByDate(socialPosts)
  const recordingTasksByDate = groupRecordingTasksByDate(recordingTasks)

  function navigate(delta: 1 | -1) {
    const next = delta === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
    router.push(`/admin/calendar?y=${next.getFullYear()}&m=${next.getMonth()}`)
  }

  function goToToday() {
    const now = new Date()
    router.push(`/admin/calendar?y=${now.getFullYear()}&m=${now.getMonth()}`)
  }

  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event)
    setReviews([])
    startTransition(async () => {
      const data = await getEventReviews(event.id)
      setReviews(data)
    })
  }

  function handleEventCreated(event: CalendarEvent) {
    setEvents((prev) => [...prev, event])
  }

  function handleEventUpdate(updated: Partial<CalendarEvent> & { id: string }) {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e))
    )
    setSelectedEvent((e) => (e?.id === updated.id ? { ...e, ...updated } : e))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Calendar</h1>
          <p className="text-sm text-white/45">EDM events and show schedule — Toronto, ON</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateSheetOpen(true)}
            className="admin-btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
          >
            <Plus className="size-4" aria-hidden="true" />
            Create Event
          </button>
          <button
            onClick={goToToday}
            className="admin-btn-ghost px-4 py-2 rounded-lg text-sm"
          >
            Today
          </button>
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous month"
            className="p-2 text-white/50 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <h2 className="text-lg font-bold text-white min-w-[180px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigate(1)}
            aria-label="Next month"
            className="p-2 text-white/50 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="admin-card p-4">
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-7 mb-2">
              {DAY_HEADERS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-bold text-white/30 uppercase tracking-widest py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <CalendarGrid
              year={year}
              month={month}
              eventsByDate={eventsByDate}
              socialPostsByDate={socialPostsByDate}
              recordingTasksByDate={recordingTasksByDate}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FAA21B]/30 border border-[#FAA21B]/50" />
          Event
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/30 border border-purple-500/50" />
          Festival
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/30 border border-blue-500/50" />
          Livestream
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-500/30 border border-green-500/50" />
          Social Post
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500/50" />
          Recording Session
        </span>
      </div>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        hosts={hosts}
        reviews={reviews}
        currentUserId={currentUserId}
        onEventUpdate={handleEventUpdate}
      />

      <CreateEventSheet
        open={createSheetOpen}
        onClose={() => setCreateSheetOpen(false)}
        onCreated={handleEventCreated}
        hosts={hosts}
      />
    </div>
  )
}
