'use client'

import { Link2 } from 'lucide-react'
import type { RecordingSessionTask } from '@/types'

export function RecordingSessionChip({ task }: { task: RecordingSessionTask }) {
  return (
    <div
      title={task.title}
      className={[
        'w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold',
        'border truncate leading-tight flex items-center gap-1',
        'bg-red-500/20 border-red-500/40 text-red-200',
      ].join(' ')}
    >
      <span className="truncate">{task.title}</span>
      {task.event_id && <Link2 className="size-2.5 flex-shrink-0 opacity-60" aria-hidden="true" />}
    </div>
  )
}
