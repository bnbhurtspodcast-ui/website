'use client'

import type { CalendarEvent } from '@/types'
import { EVENT_TYPE_COLORS, resolveEventType } from '@/app/(admin)/admin/calendar/eventTypeColors'

export function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent
  onClick: () => void
}) {
  const effectiveType = resolveEventType(event)
  const chipClass = EVENT_TYPE_COLORS[effectiveType].chip
  const showReviewedDot =
    event.reviewed === true &&
    (effectiveType === 'event' || effectiveType === 'festival' || effectiveType === 'livestream')

  const timePrefix = event.start_time ? event.start_time.slice(0, 5) + ' ' : ''

  return (
    <button
      onClick={onClick}
      title={event.name}
      className={[
        'w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold',
        'border truncate transition-colors leading-tight',
        chipClass,
      ].join(' ')}
    >
      {timePrefix}{event.name}{showReviewedDot && <span className="ml-1 text-green-400 not-italic">●</span>}
    </button>
  )
}
