import type { EventType } from '@/types'

export const EVENT_TYPE_COLORS: Record<
  EventType,
  { chip: string; badge: string; dot: string }
> = {
  event: {
    chip: 'bg-[#FAA21B]/15 border-[#FAA21B]/35 text-[#FAA21B] hover:bg-[#FAA21B]/25',
    badge: 'bg-[#FAA21B]/15 text-[#FAA21B] border border-[#FAA21B]/30',
    dot: 'bg-[#FAA21B]/30 border border-[#FAA21B]/50',
  },
  festival: {
    chip: 'bg-purple-500/20 border-purple-500/40 text-purple-200 hover:bg-purple-500/30',
    badge: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    dot: 'bg-purple-500/30 border border-purple-500/50',
  },
  livestream: {
    chip: 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    dot: 'bg-blue-500/30 border border-blue-500/50',
  },
  social_post: {
    chip: 'bg-green-500/20 border-green-500/40 text-green-200 hover:bg-green-500/30',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/30',
    dot: 'bg-green-500/30 border border-green-500/50',
  },
  recording_session: {
    chip: 'bg-red-500/20 border-red-500/40 text-red-200 hover:bg-red-500/30',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
    dot: 'bg-red-500/30 border border-red-500/50',
  },
}

export function resolveEventType(event: {
  event_type?: EventType | null
  festival_ind: boolean
  livestream_ind: boolean
}): EventType {
  if (event.event_type) return event.event_type
  if (event.festival_ind) return 'festival'
  if (event.livestream_ind) return 'livestream'
  return 'event'
}
