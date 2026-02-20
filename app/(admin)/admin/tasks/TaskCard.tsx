'use client'

import { useRef } from 'react'
import { Calendar, Trash2, Tag } from 'lucide-react'
import type { Task } from '@/types'
import { LABEL_COLOR_MAP, PRIORITY_COLOR } from './constants'
import { getInitials, getAvatarColor, formatDueDate } from './taskUtils'

type TaskCardProps = {
  task: Task
  onDelete: (id: string) => void
  onClick: (task: Task) => void
}

export function TaskCard({ task, onDelete, onClick }: TaskCardProps) {
  const isDragging = useRef(false)

  const handleDragStart = (e: React.DragEvent) => {
    isDragging.current = true
    e.dataTransfer.setData('taskId', task.id)
  }

  const handleDragEnd = () => {
    // Reset after a short delay to let mouseup fire first if needed
    setTimeout(() => { isDragging.current = false }, 0)
  }

  const handleMouseUp = () => {
    if (!isDragging.current) {
      onClick(task)
    }
  }

  const dueDate = task.due_date ? formatDueDate(task.due_date) : null

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseUp={handleMouseUp}
      className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group select-none"
    >
      {/* Top row: label dot + priority badge + delete button */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {task.label_color && LABEL_COLOR_MAP[task.label_color] && (
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${LABEL_COLOR_MAP[task.label_color]}`}
              title={task.label_color}
            />
          )}
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_COLOR[task.priority] ?? ''}`}>
            {task.priority}
          </span>
        </div>
        <button
          onMouseDown={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[#112B4F] mb-1 leading-snug">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 text-xs bg-[#FAA21B]/10 text-[#FAA21B] px-1.5 py-0.5 rounded">
              <Tag className="h-2.5 w-2.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: avatar + due date */}
      {(task.assignee || task.due_date) && (
        <div className="flex items-center justify-between mt-2">
          {task.assignee ? (
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${getAvatarColor(task.assignee)}`}
              title={task.assignee}
            >
              {getInitials(task.assignee)}
            </div>
          ) : (
            <div />
          )}
          {dueDate && (
            <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${dueDate.colorClass}`}>
              <Calendar className="h-3 w-3" />
              <span>{dueDate.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
