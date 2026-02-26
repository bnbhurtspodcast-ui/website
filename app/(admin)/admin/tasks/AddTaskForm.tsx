'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { LayoutList, Calendar, Search, X } from 'lucide-react'
import { getEvents } from '../actions'
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
  event_id: string
}

export const emptyForm: AddForm = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  assignee_user_id: '',
  due_date: '',
  event_id: '',
}

type AddTaskDrawerProps = {
  open: boolean
  columnName: string
  colId: string
  form: AddForm
  users: { id: string; name: string; user_id: string | null }[]
  isPending: boolean
  onChange: (patch: Partial<AddForm>) => void
  onAssigneePick: (userId: string) => void
  onSubmit: () => void
  onCancel: () => void
}

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

type EventResult = {
  id: string
  name: string
  event_date: string
  venue_name: string | null
  hosts: string[]
}

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
  const isEventsColumn = columnName === 'Events'
  const [eventQuery, setEventQuery] = useState('')
  const [eventResults, setEventResults] = useState<EventResult[]>([])
  const [isSearching, startSearch] = useTransition()

  // Local text state — avoids re-rendering TaskBoard on every keystroke
  const [localTitle, setLocalTitle] = useState(form.title)
  const [localDescription, setLocalDescription] = useState(form.description)
  // Keep refs so the submit handler can read the latest value synchronously
  const localTitleRef = useRef(localTitle)
  const localDescRef = useRef(localDescription)
  localTitleRef.current = localTitle
  localDescRef.current = localDescription

  // Sync local text when the parent resets the form (e.g. event picked, drawer reopened)
  useEffect(() => {
    setLocalTitle(form.title)
    setLocalDescription(form.description)
  }, [form.title, form.description])

  // Reset search state when drawer closes
  useEffect(() => {
    if (!open) {
      setEventQuery('')
      setEventResults([])
    }
  }, [open])

  // Debounced event search
  useEffect(() => {
    if (!isEventsColumn) return
    if (eventQuery.trim().length < 2) {
      setEventResults([])
      return
    }
    const timer = setTimeout(() => {
      startSearch(async () => {
        const results = await getEvents(eventQuery)
        setEventResults(results as EventResult[])
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [eventQuery, isEventsColumn])

  function handleEventPick(ev: EventResult) {
    const firstHost = ev.hosts?.[0] ?? ''
    onChange({
      title: ev.name,
      description: [ev.venue_name, ev.event_date].filter(Boolean).join(' — '),
      assignee: firstHost,
      assignee_user_id: '',
      event_id: ev.id,
      due_date: ev.event_date ?? '',
    })
    setEventQuery('')
    setEventResults([])
  }

  function clearLinkedEvent() {
    onChange({ title: '', description: '', assignee: '', assignee_user_id: '', event_id: '' })
  }

  function handleSubmit() {
    // Flush local text to parent before submit
    onChange({ title: localTitleRef.current, description: localDescRef.current })
    // Let React flush the state update, then submit
    setTimeout(onSubmit, 0)
  }

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

          {/* Event picker — only for "Events" column */}
          {isEventsColumn && (
            <div>
              <label className={labelCls}>
                <Calendar className="inline h-3 w-3 mr-1 mb-0.5 text-[#FAA21B]" aria-hidden="true" />
                Link Event
              </label>

              {/* Linked event banner */}
              {form.event_id ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAA21B]/10 border border-[#FAA21B]/30">
                  <span className="text-xs text-[#FAA21B]/90 font-semibold truncate">{form.title}</span>
                  <button
                    onClick={clearLinkedEvent}
                    className="text-white/30 hover:text-white/70 ml-2 flex-shrink-0 transition-colors"
                    aria-label="Clear linked event"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search events by name…"
                      value={eventQuery}
                      onChange={(e) => setEventQuery(e.target.value)}
                      className={`${inputCls} pl-8`}
                    />
                  </div>

                  {isSearching && (
                    <p className="text-[11px] text-white/30 mt-1.5 px-1">Searching…</p>
                  )}

                  {!isSearching && eventResults.length > 0 && (
                    <div className="mt-1.5 rounded-lg border border-white/10 bg-[#080f1a] overflow-hidden max-h-48 overflow-y-auto">
                      {eventResults.map((ev) => (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => handleEventPick(ev)}
                          className="w-full text-left px-3 py-2.5 hover:bg-white/6 transition-colors border-b border-white/5 last:border-0"
                        >
                          <p className="text-sm text-white/80 font-medium truncate">{ev.name}</p>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            {ev.event_date}{ev.venue_name ? ` · ${ev.venue_name}` : ''}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-[#FAA21B]">*</span></label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={(e) => onChange({ title: e.target.value })}
              className={inputCls}
              autoFocus={!isEventsColumn}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              placeholder="Add more context or details..."
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={(e) => onChange({ description: e.target.value })}
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
                  <option key={u.id} value={u.user_id ?? u.id} className="bg-[#08111e]">
                    {u.name}
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
            onClick={handleSubmit}
            disabled={isPending || !localTitle.trim()}
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
