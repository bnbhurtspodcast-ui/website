'use client'

import { buildCalendarGrid, toDateKey, isSameMonth, isToday } from '@/app/(admin)/admin/calendar/calendarUtils'
import { CalendarCell } from '@/app/(admin)/admin/calendar/CalendarCell'
import type { CalendarEvent, SocialPost } from '@/types'

export function CalendarGrid({
  year,
  month,
  eventsByDate,
  socialPostsByDate,
  onEventClick,
}: {
  year: number
  month: number
  eventsByDate: Record<string, CalendarEvent[]>
  socialPostsByDate: Record<string, SocialPost[]>
  onEventClick: (event: CalendarEvent) => void
}) {
  const days = buildCalendarGrid(year, month)
  const currentMonth = new Date(year, month, 1)

  return (
    <div className="grid grid-cols-7 gap-px bg-white/5 rounded-xl overflow-hidden">
      {days.map((day) => (
        <CalendarCell
          key={day.toISOString()}
          day={day}
          events={eventsByDate[toDateKey(day)] ?? []}
          socialPosts={socialPostsByDate[toDateKey(day)] ?? []}
          isCurrentMonth={isSameMonth(day, currentMonth)}
          isToday={isToday(day)}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}
