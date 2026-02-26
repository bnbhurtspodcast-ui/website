'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Tag, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import type { Task } from '@/types'
import { PRIORITY_GLOW } from '@/app/(admin)/admin/tasks/constants'
import { getInitials, getAvatarColor } from '@/app/(admin)/admin/tasks/taskUtils'

type EditForm = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee_ids: string[]
  due_date: string
  label_color: string
  tags: string
}

function taskToForm(task: Task): EditForm {
  return {
    title:        task.title,
    description:  task.description ?? '',
    priority:     task.priority,
    assignee_ids: task.assignee_ids ?? [],
    due_date:     task.due_date ?? '',
    label_color:  task.label_color ?? '',
    tags:         task.tags.join(', '),
  }
}

type TaskDetailModalProps = {
  task: Task | null
  users: { id: string; name: string; user_id: string | null }[]
  onClose: () => void
  onSave: (id: string, data: Partial<Task>) => void
  onDelete: (id: string) => void
}

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

export function TaskDetailModal({ task, users, onClose, onSave, onDelete }: TaskDetailModalProps) {
  const [form, setForm] = useState<EditForm>(task ? taskToForm(task) : taskToForm({
    id: '', title: '', description: '', column_id: '', priority: 'medium',
    assignee_names: [], assignee_ids: [], tags: [], sort_order: 0, created_at: '',
  }))

  useEffect(() => {
    if (task) setForm(taskToForm(task))
  }, [task])

  const patch = (partial: Partial<EditForm>) => setForm((f) => ({ ...f, ...partial }))

  const toggleAssignee = (val: string) => {
    setForm((f) => {
      const already = f.assignee_ids.includes(val)
      return {
        ...f,
        assignee_ids: already
          ? f.assignee_ids.filter((id) => id !== val)
          : [...f.assignee_ids, val],
      }
    })
  }

  const removeAssignee = (val: string) => {
    setForm((f) => ({ ...f, assignee_ids: f.assignee_ids.filter((id) => id !== val) }))
  }

  const handleSave = () => {
    if (!task) return
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const assignee_names = form.assignee_ids.map((id) => {
      const u = users.find((h) => (h.user_id ?? h.id) === id)
      return u?.name ?? ''
    }).filter(Boolean)
    onSave(task.id, {
      title:          form.title,
      description:    form.description,
      priority:       form.priority,
      assignee_ids:   form.assignee_ids,
      assignee_names,
      due_date:       form.due_date || undefined,
      label_color:    form.label_color || undefined,
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
                         focus:border-[#FAA21B]/60 outline-none pb-1 bg-transparent placeholder-white/30 transition-none"
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

          {/* Priority + Due Date grid */}
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
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => patch({ due_date: e.target.value })}
                className={`${inputCls} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Assignees multi-select */}
          <div>
            <label className={labelCls}>Assignees</label>

            {/* Selected pills */}
            {form.assignee_ids.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.assignee_ids.map((id) => {
                  const u = users.find((h) => (h.user_id ?? h.id) === id)
                  const name = u?.name ?? id
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/10 text-white border border-white/15"
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${getAvatarColor(name)}`}>
                        {getInitials(name)}
                      </span>
                      {name}
                      <button
                        type="button"
                        onClick={() => removeAssignee(id)}
                        className="text-white/40 hover:text-white/80 transition-colors ml-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            {/* Toggleable user list */}
            <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
              {users.length === 0 && (
                <p className="px-3 py-2.5 text-sm text-white/30">No team members found</p>
              )}
              {users.map((u) => {
                const val = u.user_id ?? u.id
                const selected = form.assignee_ids.includes(val)
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleAssignee(val)}
                    className={[
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors border-b border-white/5 last:border-0',
                      selected
                        ? 'bg-[#FAA21B]/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getAvatarColor(u.name)}`}>
                      {getInitials(u.name)}
                    </span>
                    <span className="flex-1 text-left">{u.name}</span>
                    {selected && (
                      <span className="w-4 h-4 rounded-full bg-[#FAA21B] flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#08111e]" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2.5 2.5L8 3" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
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
