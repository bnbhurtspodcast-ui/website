'use client'

import { Plus, Calendar, User as UserIcon, Tag, Trash2 } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import type { Task, KanbanColumn } from '@/types'
import { updateTaskColumn, createTask, deleteTask, getUsers } from '../actions'

// ── Color maps (written as literals so Tailwind doesn't purge them) ──────────
const COLUMN_COLOR_MAP: Record<string, string> = {
  gray:   'border-gray-400',
  purple: 'border-purple-400',
  blue:   'border-blue-400',
  cyan:   'border-cyan-400',
  orange: 'border-orange-400',
  yellow: 'border-yellow-400',
  red:    'border-red-400',
  pink:   'border-pink-400',
  indigo: 'border-indigo-400',
  amber:  'border-amber-400',
  green:  'border-green-400',
  teal:   'border-teal-400',
  violet: 'border-violet-400',
  lime:   'border-lime-400',
}

const LABEL_COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  orange: 'bg-orange-400',
  purple: 'bg-purple-400',
  red:    'bg-red-400',
  yellow: 'bg-yellow-400',
}

const priorityColor: Record<string, string> = {
  high:   'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low:    'bg-green-100 text-green-700 border-green-300',
}

type AuthUser = { id: string; email: string; name: string }

type AddForm = {
  title: string
  description: string
  priority: string
  assignee: string
  assignee_user_id: string
  due_date: string
}

const emptyForm: AddForm = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  assignee_user_id: '',
  due_date: '',
}

export function TaskBoardClient({
  tasks: initialTasks,
  columns,
}: {
  tasks: Task[]
  columns: KanbanColumn[]
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [form, setForm] = useState<AddForm>(emptyForm)
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getUsers().then((result) => {
      if (result.users) setUsers(result.users)
    })
  }, [])

  const tasksForColumn = (colId: string) => tasks.filter((t) => t.column_id === colId)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column_id: colId } : t))
    startTransition(() => updateTaskColumn(taskId, colId))
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleAssigneePick = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    setForm((f) => ({
      ...f,
      assignee_user_id: userId,
      assignee: user ? user.name || user.email : '',
    }))
  }

  const handleAdd = (colId: string) => {
    if (!form.title.trim()) return
    startTransition(async () => {
      await createTask({
        title:            form.title,
        description:      form.description,
        column_id:        colId,
        priority:         form.priority,
        assignee:         form.assignee || undefined,
        assignee_user_id: form.assignee_user_id || undefined,
        due_date:         form.due_date || undefined,
      })
      const tempTask: Task = {
        id:               Math.random().toString(),
        title:            form.title,
        description:      form.description,
        column_id:        colId,
        priority:         form.priority as Task['priority'],
        assignee:         form.assignee || undefined,
        assignee_user_id: form.assignee_user_id || undefined,
        due_date:         form.due_date || undefined,
        tags:             [],
        sort_order:       0,
        created_at:       new Date().toISOString(),
      }
      setTasks((prev) => [...prev, tempTask])
    })
    setForm(emptyForm)
    setAddingTo(null)
  }

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    startTransition(() => deleteTask(taskId))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
        <p className="text-[#FAA21B]">Organize and track your team&apos;s work</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {columns.map((col) => {
            const colTasks = tasksForColumn(col.id)
            const borderClass = COLUMN_COLOR_MAP[col.color] ?? 'border-gray-400'

            return (
              <div
                key={col.id}
                className="flex flex-col w-80 flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10"
                onDrop={(e) => handleDrop(e, col.id)}
                onDragOver={handleDragOver}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between p-4 border-b-4 ${borderClass}`}>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{col.name}</h2>
                    <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-1 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks — scrollable per column */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group"
                    >
                      {/* Top row: label dot + priority + delete */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {task.label_color && LABEL_COLOR_MAP[task.label_color] && (
                            <span
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${LABEL_COLOR_MAP[task.label_color]}`}
                              title={task.label_color}
                            />
                          )}
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${priorityColor[task.priority] ?? ''}`}>
                            {task.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-[#112B4F] mb-2">{task.title}</h3>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-[#FAA21B]/10 text-[#FAA21B] px-2 py-1 rounded">
                              <Tag className="h-3 w-3" />{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        {task.assignee && (
                          <div className="flex items-center gap-1 min-w-0">
                            <UserIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{task.assignee}</span>
                          </div>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span>{task.due_date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add task form / button */}
                  {addingTo === col.id ? (
                    <div className="bg-white rounded-lg p-4 shadow-md space-y-2">
                      <input
                        type="text"
                        placeholder="Task title..."
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
                        autoFocus
                      />
                      <textarea
                        placeholder="Description..."
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none resize-none text-sm"
                        rows={2}
                      />
                      <select
                        value={form.priority}
                        onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
                      >
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                      </select>

                      {/* Assignee picker */}
                      <select
                        value={form.assignee_user_id}
                        onChange={(e) => handleAssigneePick(e.target.value)}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
                      >
                        <option value="">No assignee</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name || u.email}
                          </option>
                        ))}
                      </select>

                      {/* Due date */}
                      <input
                        type="date"
                        value={form.due_date}
                        onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
                      />

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleAdd(col.id)}
                          disabled={isPending}
                          className="flex-1 px-4 py-2 bg-[#FAA21B] text-[#112B4F] rounded font-bold hover:bg-[#FAA21B]/90 transition-colors text-sm disabled:opacity-60"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => setAddingTo(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingTo(col.id); setForm(emptyForm) }}
                      className="w-full py-3 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
