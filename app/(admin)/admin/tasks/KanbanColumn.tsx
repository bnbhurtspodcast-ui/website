'use client'

import { Plus } from 'lucide-react'
import type { Task, KanbanColumn as KanbanColumnType } from '@/types'
import { COLUMN_TOP_COLOR_MAP } from './constants'
import { TaskCard } from './TaskCard'

type KanbanColumnProps = {
  column: KanbanColumnType
  tasks: Task[]
  onDrop: (e: React.DragEvent, colId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDeleteTask: (id: string) => void
  onTaskClick: (task: Task) => void
  onStartAdding: (colId: string) => void
}

export function KanbanColumn({
  column,
  tasks,
  onDrop,
  onDragOver,
  onDeleteTask,
  onTaskClick,
  onStartAdding,
}: KanbanColumnProps) {
  const dotColor = COLUMN_TOP_COLOR_MAP[column.color] ?? 'bg-gray-400'

  return (
    <div
      className="flex flex-col w-72 flex-shrink-0 rounded-xl border border-white/[0.07] bg-[#0a1628]/60 backdrop-blur-sm"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={onDragOver}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          {/* Colored dot indicator */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} shadow-[0_0_6px_currentColor]`} />
          <h2 className="text-sm font-semibold text-white/90 tracking-wide">{column.name}</h2>
          <span className="text-[10px] font-bold text-white/40 bg-white/8 px-1.5 py-0.5 rounded-full tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks — scrollable */}
      <div className="flex-1 p-2.5 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onClick={onTaskClick}
          />
        ))}

        {/* Add Task button — opens drawer */}
        <button
          onClick={() => onStartAdding(column.id)}
          className="w-full py-2.5 mt-1 rounded-lg border border-dashed border-[#FAA21B]/25
                     text-[#FAA21B]/50 hover:border-[#FAA21B]/60 hover:text-[#FAA21B]
                     hover:bg-[#FAA21B]/5 transition-all duration-200
                     flex items-center justify-center gap-2 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </button>
      </div>
    </div>
  )
}
