import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns'

import type { CalendarEvent } from '@/types'

// Returns the 35–42 day grid for a given month, Mon–Sun weeks
export function buildCalendarGrid(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month, 1))
  const monthEnd = endOfMonth(monthStart)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

// "YYYY-MM-DD" key used to bucket events by day
export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// Groups an array of events into a date-keyed map
export function groupEventsByDate(
  events: CalendarEvent[]
): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const key = event.event_date
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})
}

export { isSameMonth, isToday, parseISO, format }
