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
import { LABEL_COLOR_MAP, PRIORITY_GLOW } from './constants'

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

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-200',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60',
  'focus:shadow-[0_0_0_3px_rgba(250,162,27,0.08)]',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

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
        className="w-full sm:max-w-md flex flex-col p-0 gap-0 bg-[#08111e] border-l border-white/10"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="pr-6">
            <input
              type="text"
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              className="w-full text-base font-bold text-white border-0 border-b-2 border-transparent
                         focus:border-[#FAA21B]/60 outline-none pb-1 bg-transparent placeholder-white/30"
              placeholder="Task title"
            />
          </div>
          <SheetTitle className="sr-only">Edit task</SheetTitle>
          <span className={`self-start mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full ${PRIORITY_GLOW[form.priority] ?? ''}`}>
            {form.priority}
          </span>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

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
                className={`${inputCls} appearance-none`}
              >
                <option value="low" className="bg-[#08111e]">Low</option>
                <option value="medium" className="bg-[#08111e]">Medium</option>
                <option value="high" className="bg-[#08111e]">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Label Color</label>
              <select
                value={form.label_color}
                onChange={(e) => patch({ label_color: e.target.value })}
                className={`${inputCls} appearance-none`}
              >
                <option value="" className="bg-[#08111e]">None</option>
                {Object.keys(LABEL_COLOR_MAP).map((color) => (
                  <option key={color} value={color} className="bg-[#08111e]">{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assignee</label>
              <select
                value={form.assignee_user_id}
                onChange={(e) => handleAssigneePick(e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                <option value="" className="bg-[#08111e]">No assignee</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#08111e]">{u.name || u.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => patch({ due_date: e.target.value })}
                className={`${inputCls} [color-scheme:dark]`}
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
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-[#FAA21B]/10 text-[#FAA21B] px-2 py-0.5 rounded-md border border-[#FAA21B]/20">
                    <Tag className="h-3 w-3" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments placeholder */}
          <div>
            <label className={labelCls}>Comments</label>
            <div className="flex items-center gap-2 p-4 border border-dashed border-white/10 rounded-lg text-sm text-white/25">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              Comments coming soon
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-5 py-4 border-t border-white/10 flex-row gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30
                       hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-semibold"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#FAA21B] text-[#0a1628] font-bold text-sm
                       hover:bg-[#FAA21B]/90 hover:shadow-[0_0_20px_rgba(250,162,27,0.35)] transition-all duration-200"
          >
            Save Changes
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
