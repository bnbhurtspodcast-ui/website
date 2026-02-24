'use client'

import { LayoutList } from 'lucide-react'
import type { AuthUser } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'

export type AddForm = {
  title: string
  description: string
  priority: string
  assignee: string
  assignee_user_id: string
  due_date: string
}

export const emptyForm: AddForm = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  assignee_user_id: '',
  due_date: '',
}

type AddTaskDrawerProps = {
  open: boolean
  columnName: string
  colId: string
  form: AddForm
  users: AuthUser[]
  isPending: boolean
  onChange: (patch: Partial<AddForm>) => void
  onAssigneePick: (userId: string) => void
  onSubmit: () => void
  onCancel: () => void
}

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-200',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60 focus:bg-white/8',
  'focus:shadow-[0_0_0_3px_rgba(250,162,27,0.08)]',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

export function AddTaskDrawer({
  open,
  columnName,
  form,
  users,
  isPending,
  onChange,
  onAssigneePick,
  onSubmit,
  onCancel,
}: AddTaskDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0 bg-[#08111e] border-l border-white/10"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAA21B]/15 flex items-center justify-center">
              <LayoutList className="h-4 w-4 text-[#FAA21B]" />
            </div>
            <div>
              <SheetTitle className="text-white text-base font-bold leading-tight">New Task</SheetTitle>
              <p className="text-[11px] text-white/40 mt-0.5">Adding to <span className="text-[#FAA21B]/80">{columnName}</span></p>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-[#FAA21B]">*</span></label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputCls}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              placeholder="Add more context or details..."
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className={`${inputCls} resize-none`}
              rows={3}
            />
          </div>

          {/* Priority + Assignee grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => onChange({ priority: e.target.value })}
                className={`${inputCls} appearance-none`}
              >
                <option value="low" className="bg-[#08111e]">Low</option>
                <option value="medium" className="bg-[#08111e]">Medium</option>
                <option value="high" className="bg-[#08111e]">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Assignee</label>
              <select
                value={form.assignee_user_id}
                onChange={(e) => onAssigneePick(e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                <option value="" className="bg-[#08111e]">No assignee</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#08111e]">
                    {u.name || u.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className={labelCls}>Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => onChange({ due_date: e.target.value })}
              className={`${inputCls} [color-scheme:dark]`}
            />
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-5 py-4 border-t border-white/10 flex-row gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending || !form.title.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#FAA21B] text-[#0a1628] font-bold text-sm
                       hover:bg-[#FAA21B]/90 hover:shadow-[0_0_20px_rgba(250,162,27,0.35)]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isPending ? 'Adding…' : 'Add Task'}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
