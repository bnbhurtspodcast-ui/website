'use client'

import { useRef, useState } from 'react'
import { Calendar, Trash2, Tag, MoreHorizontal } from 'lucide-react'
import type { Task, KanbanColumn } from '@/types'
import { LABEL_COLOR_MAP, PRIORITY_GLOW, COLUMN_TOP_COLOR_MAP } from './constants'
import { getInitials, getAvatarColor, formatDueDate } from './taskUtils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type TaskCardProps = {
  task: Task
  columns: KanbanColumn[]
  onDelete: (id: string) => void
  onClick: (task: Task) => void
  onMoveToColumn: (taskId: string, colId: string) => void
}

export function TaskCard({ task, columns, onDelete, onClick, onMoveToColumn }: TaskCardProps) {
  const isDragging = useRef(false)
  const [dragging, setDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    isDragging.current = true
    setDragging(true)
    e.dataTransfer.setData('taskId', task.id)
  }

  const handleDragEnd = () => {
    setDragging(false)
    setTimeout(() => { isDragging.current = false }, 0)
  }

  const handleMouseUp = () => {
    if (!isDragging.current) {
      onClick(task)
    }
  }

  const dueDate = task.due_date ? formatDueDate(task.due_date) : null
  const labelBg = task.label_color && LABEL_COLOR_MAP[task.label_color]
    ? LABEL_COLOR_MAP[task.label_color]
    : null

  const otherColumns = columns.filter((c) => c.id !== task.column_id)

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseUp={handleMouseUp}
      className={[
        'relative rounded-xl p-3 border transition-all duration-200 select-none',
        'cursor-grab active:cursor-grabbing group',
        'bg-[#0d1f38]/80 backdrop-blur-sm border-white/10',
        'hover:border-[#FAA21B]/40 hover:shadow-[0_0_18px_rgba(250,162,27,0.10)]',
        dragging ? 'opacity-50 scale-[0.97] shadow-none' : 'opacity-100',
      ].join(' ')}
    >
      {/* Label color stripe — left edge */}
      {labelBg && (
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${labelBg}`} />
      )}

      {/* Top row: priority glow pill + ellipsis menu */}
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_GLOW[task.priority] ?? ''}`}>
          {task.priority}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/70 ml-1"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="bg-[#08111e] border border-white/10 text-white text-xs min-w-[160px]"
          >
            {otherColumns.map((col) => (
              <DropdownMenuItem
                key={col.id}
                onSelect={() => onMoveToColumn(task.id, col.id)}
                className="text-white/70 hover:text-white focus:text-white cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${COLUMN_TOP_COLOR_MAP[col.color] ?? 'bg-gray-400'}`} />
                {col.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onSelect={() => onDelete(task.id)}
              className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white mb-1 leading-snug">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-white/40 mb-2 line-clamp-1">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 text-[10px] bg-[#FAA21B]/10 text-[#FAA21B] px-1.5 py-0.5 rounded-md border border-[#FAA21B]/20">
              <Tag className="h-2.5 w-2.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: avatar + due date */}
      {(task.assignee || task.due_date) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          {task.assignee ? (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ring-1 ring-white/20 ${getAvatarColor(task.assignee)}`}
              title={task.assignee}
            >
              {getInitials(task.assignee)}
            </div>
          ) : (
            <div />
          )}
          {dueDate && (
            <div className={`flex items-center gap-1 text-[10px] flex-shrink-0 ${dueDate.colorClass}`}>
              <Calendar className="h-3 w-3" />
              <span>{dueDate.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
