'use client'

import type { AuthUser } from '@/types'

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

type AddTaskFormProps = {
  colId: string
  form: AddForm
  users: AuthUser[]
  isPending: boolean
  onChange: (patch: Partial<AddForm>) => void
  onAssigneePick: (userId: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export function AddTaskForm({
  form,
  users,
  isPending,
  onChange,
  onAssigneePick,
  onSubmit,
  onCancel,
}: AddTaskFormProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md space-y-2">
      <input
        type="text"
        placeholder="Task title..."
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
        autoFocus
      />
      <textarea
        placeholder="Description..."
        value={form.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none resize-none text-sm"
        rows={2}
      />
      <select
        value={form.priority}
        onChange={(e) => onChange({ priority: e.target.value })}
        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <select
        value={form.assignee_user_id}
        onChange={(e) => onAssigneePick(e.target.value)}
        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
      >
        <option value="">No assignee</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name || u.email}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={form.due_date}
        onChange={(e) => onChange({ due_date: e.target.value })}
        className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none text-sm"
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={onSubmit}
          disabled={isPending}
          className="flex-1 px-4 py-2 bg-[#FAA21B] text-[#112B4F] rounded font-bold hover:bg-[#FAA21B]/90 transition-colors text-sm disabled:opacity-60"
        >
          Add Task
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
