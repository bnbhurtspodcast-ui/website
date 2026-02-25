'use client'

import { format } from 'date-fns'
import { EventChip } from './EventChip'
import type { CalendarEvent } from '@/types'

const MAX_VISIBLE = 3

export function CalendarCell({
  day,
  events,
  isCurrentMonth,
  isToday,
  onEventClick,
}: {
  day: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
  onEventClick: (event: CalendarEvent) => void
}) {
  const visible = events.slice(0, MAX_VISIBLE)
  const overflowCount = events.length - MAX_VISIBLE

  return (
    <div
      className={[
        'min-h-[120px] p-2 flex flex-col gap-1',
        'bg-[#080f1a]/80 transition-colors',
        isCurrentMonth ? '' : 'opacity-35',
      ].join(' ')}
    >
      {/* Day number */}
      <span
        className={[
          'text-xs font-bold self-end px-1.5 py-0.5 rounded-md leading-none',
          isToday
            ? 'bg-[#FAA21B] text-[#080f1a]'
            : 'text-white/40',
        ].join(' ')}
      >
        {format(day, 'd')}
      </span>

      {/* Event chips */}
      <div className="flex flex-col gap-0.5 flex-1">
        {visible.map((event) => (
          <EventChip
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
        {overflowCount > 0 && (
          <button
            className="text-[10px] text-white/35 hover:text-white/70 text-left px-1 py-0.5 transition-colors"
            onClick={() => onEventClick(events[MAX_VISIBLE])}
            aria-label={`${overflowCount} more events on ${format(day, 'MMMM d')}`}
          >
            +{overflowCount} more
          </button>
        )}
      </div>
    </div>
  )
}
