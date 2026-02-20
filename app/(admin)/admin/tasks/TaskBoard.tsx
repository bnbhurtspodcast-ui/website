'use client'

import { useState, useTransition, useEffect } from 'react'
import type { Task, KanbanColumn, AuthUser } from '@/types'
import { updateTaskColumn, createTask, deleteTask, getUsers, updateTask } from '../actions'
import { KanbanColumn as KanbanColumnComponent } from './KanbanColumn'
import { TaskDetailModal } from './TaskDetailModal'
import { type AddForm, emptyForm } from './AddTaskForm'

export function TaskBoard({
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getUsers().then((result) => {
      if (result.users) setUsers(result.users)
    })
  }, [])

  const tasksForColumn = (colId: string) => tasks.filter((t) => t.column_id === colId)

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column_id: colId } : t))
    startTransition(() => updateTaskColumn(taskId, colId))
  }

  const handleAssigneePick = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    setForm((f) => ({
      ...f,
      assignee_user_id: userId,
      assignee: user ? (user.name || user.email) : '',
    }))
  }

  const handleAdd = (colId: string) => {
    if (!form.title.trim()) return
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
    setForm(emptyForm)
    setAddingTo(null)
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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
        <p className="text-[#FAA21B]">Organize and track your team&apos;s work</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {columns.map((col) => (
            <KanbanColumnComponent
              key={col.id}
              column={col}
              tasks={tasksForColumn(col.id)}
              users={users}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDeleteTask={handleDelete}
              onTaskClick={handleTaskClick}
              addingTo={addingTo}
              onStartAdding={(colId) => { setAddingTo(colId); setForm(emptyForm) }}
              onCancelAdding={() => setAddingTo(null)}
              onAddTask={handleAdd}
              form={form}
              onFormChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
              onAssigneePick={handleAssigneePick}
              isPending={isPending}
            />
          ))}
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        users={users}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
