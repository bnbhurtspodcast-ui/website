'use client'

import type { CalendarEvent } from '@/types'

export function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent
  onClick: () => void
}) {
  const chipClass = event.festival_ind
    ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 hover:bg-purple-500/30'
    : event.livestream_ind
    ? 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30'
    : 'bg-[#FAA21B]/15 border-[#FAA21B]/35 text-[#FAA21B] hover:bg-[#FAA21B]/25'

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
      {timePrefix}{event.name}
    </button>
  )
}
