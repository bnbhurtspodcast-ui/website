'use client'

import { useState, useTransition } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { createEvent } from '@/app/(admin)/admin/calendar/actions'
import { EdmtrainSearchPanel } from '@/app/(admin)/admin/calendar/EdmtrainSearchPanel'
import type { CalendarEvent, EventType } from '@/types'

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'event',             label: 'Event' },
  { value: 'festival',          label: 'Festival' },
  { value: 'livestream',        label: 'Livestream' },
  { value: 'social_post',       label: 'Social Post' },
  { value: 'recording_session', label: 'Recording Session' },
]

const inputCls = [
  'w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none',
  'bg-white/5 border border-white/10 focus:border-[#FAA21B]/60 transition-colors',
].join(' ')

const labelCls = 'block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest'

type FormState = {
  name: string
  event_type: EventType
  event_date: string
  start_time: string
  end_time: string
  venue_name: string
  venue_location: string
  venue_address: string
  description: string
  link: string
  ages: string
  notes: string
  hosts: string[]
  edmtrain_id: number | null
}

const emptyForm: FormState = {
  name: '',
  event_type: 'event',
  event_date: '',
  start_time: '',
  end_time: '',
  venue_name: '',
  venue_location: '',
  venue_address: '',
  description: '',
  link: '',
  ages: '',
  notes: '',
  hosts: [],
  edmtrain_id: null,
}

export function CreateEventSheet({
  open,
  onClose,
  onCreated,
  hosts,
  defaultDate,
}: {
  open: boolean
  onClose: () => void
  onCreated?: (event: CalendarEvent) => void
  hosts: { id: string; name: string }[]
  defaultDate?: string
}) {
  const [form, setForm] = useState<FormState>({ ...emptyForm, event_date: defaultDate ?? '' })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function patch(updates: Partial<FormState>) {
    setForm((f) => ({ ...f, ...updates }))
  }

  function toggleHost(id: string) {
    setForm((f) => ({
      ...f,
      hosts: f.hosts.includes(id) ? f.hosts.filter((h) => h !== id) : [...f.hosts, id],
    }))
  }

  function handleClose() {
    setForm({ ...emptyForm, event_date: defaultDate ?? '' })
    setError(null)
    onClose()
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.event_date) return
    startTransition(async () => {
      const result = await createEvent({
        name: form.name.trim(),
        event_type: form.event_type,
        event_date: form.event_date,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        venue_name: form.venue_name || null,
        venue_location: form.venue_location || null,
        venue_address: form.venue_address || null,
        description: form.description || null,
        link: form.link || null,
        ages: form.ages || null,
        notes: form.notes || null,
        hosts: form.hosts,
        edmtrain_id: form.edmtrain_id ?? null,
      })
      if (result.error) {
        setError(result.error)
      } else {
        if (result.event) onCreated?.(result.event)
        handleClose()
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-[#0a1628] border-white/10 text-white flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/8">
          <SheetTitle className="text-white text-lg font-bold">Create Event</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Event Name *</label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="e.g. Crave Toronto"
              className={inputCls}
            />
          </div>

          {/* EDMTrain search */}
          <EdmtrainSearchPanel onSelect={patch} />

          {/* Event Type */}
          <div>
            <label className={labelCls}>Event Type *</label>
            <select
              value={form.event_type}
              onChange={(e) => patch({ event_type: e.target.value as EventType })}
              className={inputCls + ' appearance-none cursor-pointer'}
            >
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0a1628]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={labelCls}>Date *</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => patch({ event_date: e.target.value })}
              className={inputCls}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => patch({ start_time: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>End Time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => patch({ end_time: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className={labelCls}>Venue Name</label>
            <input
              type="text"
              value={form.venue_name}
              onChange={(e) => patch({ venue_name: e.target.value })}
              placeholder="e.g. Rebel Toronto"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Venue Location</label>
            <input
              type="text"
              value={form.venue_location}
              onChange={(e) => patch({ venue_location: e.target.value })}
              placeholder="e.g. Toronto, ON"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Venue Address</label>
            <input
              type="text"
              value={form.venue_address}
              onChange={(e) => patch({ venue_address: e.target.value })}
              placeholder="e.g. 11 Polson St, Toronto"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Brief description of the event"
              className={inputCls + ' resize-none'}
            />
          </div>

          {/* Link */}
          <div>
            <label className={labelCls}>Event URL</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => patch({ link: e.target.value })}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          {/* Ages */}
          <div>
            <label className={labelCls}>Ages</label>
            <input
              type="text"
              value={form.ages}
              onChange={(e) => patch({ ages: e.target.value })}
              placeholder="e.g. 19+"
              className={inputCls}
            />
          </div>

          {/* Hosts */}
          {hosts.length > 0 && (
            <div>
              <label className={labelCls}>Hosts Attending</label>
              <div className="space-y-0.5 max-h-40 overflow-y-auto">
                {hosts.map((h) => (
                  <label
                    key={h.id}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.hosts.includes(h.id)}
                      onChange={() => toggleHost(h.id)}
                      className="accent-[#FAA21B] w-3.5 h-3.5 flex-shrink-0"
                    />
                    <span className="text-sm text-white/75">{h.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder="Internal notes"
              className={inputCls + ' resize-none'}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <SheetFooter className="px-6 py-4 border-t border-white/8 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 admin-btn-ghost rounded-lg text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.event_date || isPending}
            className="flex-1 py-2.5 admin-btn-primary rounded-lg text-sm disabled:opacity-40"
          >
            {isPending ? 'Creating…' : 'Create Event'}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
