'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Tag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import type { Task, AuthUser } from '@/types'
import { LABEL_COLOR_MAP, PRIORITY_COLOR } from './constants'

type EditForm = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  assignee_user_id: string
  due_date: string
  label_color: string
  tags: string
}

function taskToForm(task: Task): EditForm {
  return {
    title:            task.title,
    description:      task.description ?? '',
    priority:         task.priority,
    assignee:         task.assignee ?? '',
    assignee_user_id: task.assignee_user_id ?? '',
    due_date:         task.due_date ?? '',
    label_color:      task.label_color ?? '',
    tags:             task.tags.join(', '),
  }
}

type TaskDetailModalProps = {
  task: Task | null
  users: AuthUser[]
  onClose: () => void
  onSave: (id: string, data: Partial<Task>) => void
  onDelete: (id: string) => void
}

const inputCls = 'w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm'
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide'

export function TaskDetailModal({ task, users, onClose, onSave, onDelete }: TaskDetailModalProps) {
  const [form, setForm] = useState<EditForm>(task ? taskToForm(task) : taskToForm({
    id: '', title: '', description: '', column_id: '', priority: 'medium',
    tags: [], sort_order: 0, created_at: '',
  }))

  useEffect(() => {
    if (task) setForm(taskToForm(task))
  }, [task])

  const patch = (partial: Partial<EditForm>) => setForm((f) => ({ ...f, ...partial }))

  const handleAssigneePick = (userId: string) => {
    if (!userId) {
      patch({ assignee_user_id: '', assignee: '' })
      return
    }
    const user = users.find((u) => u.id === userId)
    patch({
      assignee_user_id: userId,
      assignee: user ? (user.name || user.email) : '',
    })
  }

  const handleSave = () => {
    if (!task) return
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    onSave(task.id, {
      title:            form.title,
      description:      form.description,
      priority:         form.priority,
      assignee:         form.assignee || undefined,
      assignee_user_id: form.assignee_user_id || undefined,
      due_date:         form.due_date || undefined,
      label_color:      form.label_color || undefined,
      tags,
    })
  }

  const handleDelete = () => {
    if (!task) return
    onDelete(task.id)
  }

  const tagList = form.tags.split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <Sheet open={task !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0 bg-white"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="pr-6">
            <input
              type="text"
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              className="w-full text-base font-bold text-[#112B4F] border-0 border-b-2 border-transparent focus:border-[#FAA21B] outline-none pb-1 bg-transparent"
              placeholder="Task title"
            />
          </div>
          <SheetTitle className="sr-only">Edit task</SheetTitle>
          <span className={`self-start mt-1 text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[form.priority] ?? ''}`}>
            {form.priority}
          </span>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Add a description..."
            />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => patch({ priority: e.target.value as EditForm['priority'] })}
                className={inputCls}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Label Color</label>
              <select
                value={form.label_color}
                onChange={(e) => patch({ label_color: e.target.value })}
                className={inputCls}
              >
                <option value="">None</option>
                {Object.keys(LABEL_COLOR_MAP).map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assignee</label>
              <select
                value={form.assignee_user_id}
                onChange={(e) => handleAssigneePick(e.target.value)}
                className={inputCls}
              >
                <option value="">No assignee</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => patch({ due_date: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => patch({ tags: e.target.value })}
              className={inputCls}
              placeholder="design, ux, v2 (comma-separated)"
            />
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagList.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-[#FAA21B]/10 text-[#FAA21B] px-2 py-0.5 rounded">
                    <Tag className="h-3 w-3" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments placeholder */}
          <div>
            <label className={labelCls}>Comments</label>
            <div className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              Comments coming soon
            </div>
          </div>
        </div>

        <SheetFooter className="px-5 py-4 border-t border-gray-100 flex-row gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-[#FAA21B] text-[#112B4F] rounded font-bold text-sm hover:bg-[#FAA21B]/90 transition-colors"
          >
            Save Changes
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
