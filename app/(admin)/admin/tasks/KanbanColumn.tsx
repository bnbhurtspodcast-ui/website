'use client'

import { Plus } from 'lucide-react'
import type { Task, KanbanColumn as KanbanColumnType, AuthUser } from '@/types'
import { COLUMN_COLOR_MAP } from './constants'
import { TaskCard } from './TaskCard'
import { AddTaskForm, type AddForm } from './AddTaskForm'

type KanbanColumnProps = {
  column: KanbanColumnType
  tasks: Task[]
  users: AuthUser[]
  onDrop: (e: React.DragEvent, colId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDeleteTask: (id: string) => void
  onTaskClick: (task: Task) => void
  addingTo: string | null
  onStartAdding: (colId: string) => void
  onCancelAdding: () => void
  onAddTask: (colId: string) => void
  form: AddForm
  onFormChange: (patch: Partial<AddForm>) => void
  onAssigneePick: (userId: string) => void
  isPending: boolean
}

export function KanbanColumn({
  column,
  tasks,
  users,
  onDrop,
  onDragOver,
  onDeleteTask,
  onTaskClick,
  addingTo,
  onStartAdding,
  onCancelAdding,
  onAddTask,
  form,
  onFormChange,
  onAssigneePick,
  isPending,
}: KanbanColumnProps) {
  const borderClass = COLUMN_COLOR_MAP[column.color] ?? 'border-gray-400'
  const isAdding = addingTo === column.id

  return (
    <div
      className="flex flex-col w-72 flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={onDragOver}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between p-3 border-b-4 ${borderClass}`}>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white">{column.name}</h2>
          <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks — scrollable */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onClick={onTaskClick}
          />
        ))}

        {/* Add task form / button */}
        {isAdding ? (
          <AddTaskForm
            colId={column.id}
            form={form}
            users={users}
            isPending={isPending}
            onChange={onFormChange}
            onAssigneePick={onAssigneePick}
            onSubmit={() => onAddTask(column.id)}
            onCancel={onCancelAdding}
          />
        ) : (
          <button
            onClick={() => onStartAdding(column.id)}
            className="w-full py-3 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>
    </div>
  )
}
