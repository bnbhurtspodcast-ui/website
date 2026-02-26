'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { Settings } from 'lucide-react'
import type { Task, KanbanColumn } from '@/types'
import { updateTaskColumn, updateTask, createTask, deleteTask, getHosts } from '@/app/(admin)/admin/actions'
import { KanbanColumn as KanbanColumnComponent } from './KanbanColumn'
import { TaskDetailModal } from './TaskDetailModal'
import { AddTaskDrawer, type AddForm, emptyForm } from './AddTaskForm'
import { ColumnManagerSheet } from './ColumnManagerSheet'

export function TaskBoard({
  tasks: initialTasks,
  columns: initialColumns,
}: {
  tasks: Task[]
  columns: KanbanColumn[]
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [addingToColumn, setAddingToColumn] = useState<KanbanColumn | null>(null)
  const [form, setForm] = useState<AddForm>(emptyForm)
  const [users, setUsers] = useState<{ id: string; name: string; user_id: string | null }[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [columnManagerOpen, setColumnManagerOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Auto-scroll refs for drag-to-edge (F4)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const pointerXRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    getHosts().then((data) => setUsers(data))
  }, [])

  const tasksForColumn = (colId: string) => tasks.filter((t) => t.column_id === colId)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    pointerXRef.current = e.clientX
  }

  const startAutoScroll = () => {
    const EDGE_THRESHOLD = 80
    const MAX_SPEED = 12

    const loop = () => {
      const el = scrollContainerRef.current
      if (!el) return
      const { left, right } = el.getBoundingClientRect()
      const x = pointerXRef.current
      const distFromLeft = x - left
      const distFromRight = right - x
      if (distFromLeft < EDGE_THRESHOLD) {
        const speed = Math.round(MAX_SPEED * (1 - distFromLeft / EDGE_THRESHOLD))
        el.scrollLeft -= speed
      } else if (distFromRight < EDGE_THRESHOLD) {
        const speed = Math.round(MAX_SPEED * (1 - distFromRight / EDGE_THRESHOLD))
        el.scrollLeft += speed
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const stopAutoScroll = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    stopAutoScroll()
    const taskId = e.dataTransfer.getData('taskId')
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column_id: colId } : t))
    startTransition(() => updateTaskColumn(taskId, colId))
  }

  const handleMoveTask = (taskId: string, colId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column_id: colId } : t))
    startTransition(() => updateTaskColumn(taskId, colId))
  }

  const handleAssigneePick = (val: string) => {
    if (!val) {
      setForm((f) => ({ ...f, assignee_user_id: '', assignee: '' }))
      return
    }
    // val is user_id (auth UUID) — match on that field
    const host = users.find((h) => (h.user_id ?? h.id) === val)
    setForm((f) => ({
      ...f,
      assignee_user_id: val,
      assignee: host?.name ?? '',
    }))
  }

  const handleAdd = () => {
    if (!addingToColumn || !form.title.trim()) return
    const colId = addingToColumn.id
    const tempTask: Task = {
      id:               Math.random().toString(),
      title:            form.title,
      description:      form.description,
      column_id:        colId,
      priority:         form.priority as Task['priority'],
      assignee:         form.assignee || undefined,
      assignee_user_id: form.assignee_user_id || undefined,
      due_date:         form.due_date || undefined,
      event_id:         form.event_id || undefined,
      tags:             [],
      sort_order:       0,
      created_at:       new Date().toISOString(),
    }
    setTasks((prev) => [...prev, tempTask])
    setForm(emptyForm)
    setAddingToColumn(null)
    startTransition(async () => {
      await createTask({
        title:            form.title,
        description:      form.description,
        column_id:        colId,
        priority:         form.priority,
        assignee:         form.assignee || undefined,
        assignee_user_id: form.assignee_user_id || undefined,
        due_date:         form.due_date || undefined,
        event_id:         form.event_id || undefined,
      })
    })
  }

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    if (selectedTask?.id === taskId) setSelectedTask(null)
    startTransition(() => deleteTask(taskId))
  }

  const handleTaskClick = (task: Task) => setSelectedTask(task)
  const handleModalClose = () => setSelectedTask(null)

  const handleModalSave = (id: string, data: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...data } : t))
    setSelectedTask(null)
    startTransition(() => updateTask(id, data))
  }

  const handleStartAdding = (colId: string) => {
    const col = columns.find((c) => c.id === colId) ?? null
    setForm(emptyForm)
    setAddingToColumn(col)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
          <p className="text-[#FAA21B]">Organize and track your team&apos;s work</p>
        </div>
        <button
          onClick={() => setColumnManagerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all text-sm"
          title="Manage columns"
        >
          <Settings className="h-4 w-4" />
          Columns
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto pb-4"
        onDragOver={handleDragOver}
        onDragStart={startAutoScroll}
        onDragEnd={stopAutoScroll}
        onDrop={stopAutoScroll}
      >
        <div className="inline-flex gap-4 min-w-full">
          {columns.map((col) => (
            <KanbanColumnComponent
              key={col.id}
              column={col}
              tasks={tasksForColumn(col.id)}
              columns={columns}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDeleteTask={handleDelete}
              onTaskClick={handleTaskClick}
              onStartAdding={handleStartAdding}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>
      </div>

      {/* Add Task Drawer */}
      <AddTaskDrawer
        open={addingToColumn !== null}
        columnName={addingToColumn?.name ?? ''}
        colId={addingToColumn?.id ?? ''}
        form={form}
        users={users}
        isPending={isPending}
        onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
        onAssigneePick={handleAssigneePick}
        onSubmit={handleAdd}
        onCancel={() => { setAddingToColumn(null); setForm(emptyForm) }}
      />

      {/* Task Detail Drawer */}
      <TaskDetailModal
        task={selectedTask}
        users={users}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleDelete}
      />

      {/* Column Manager Sheet */}
      <ColumnManagerSheet
        open={columnManagerOpen}
        columns={columns}
        onClose={() => setColumnManagerOpen(false)}
        onColumnsChange={setColumns}
      />
    </div>
  )
}
