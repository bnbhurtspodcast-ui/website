'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths } from 'date-fns'
import { CalendarGrid } from '@/app/(admin)/admin/calendar/CalendarGrid'
import { EventDetailModal } from '@/app/(admin)/admin/calendar/EventDetailModal'
import { groupEventsByDate } from '@/app/(admin)/admin/calendar/calendarUtils'
import type { CalendarEvent } from '@/types'

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarClient({
  events,
  year,
  month,
  hosts,
}: {
  events: CalendarEvent[]
  year: number
  month: number
  hosts: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const currentDate = new Date(year, month, 1)
  const eventsByDate = groupEventsByDate(events)

  function navigate(delta: 1 | -1) {
    const next = delta === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
    router.push(`/admin/calendar?y=${next.getFullYear()}&m=${next.getMonth()}`)
  }

  function goToToday() {
    const now = new Date()
    router.push(`/admin/calendar?y=${now.getFullYear()}&m=${now.getMonth()}`)
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
        {/* Day-of-week headers */}
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

        {/* Horizontally scrollable on small screens */}
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <CalendarGrid
              year={year}
              month={month}
              eventsByDate={eventsByDate}
              onEventClick={setSelectedEvent}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-white/40">
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
      </div>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        hosts={hosts}
      />
    </div>
  )
}
