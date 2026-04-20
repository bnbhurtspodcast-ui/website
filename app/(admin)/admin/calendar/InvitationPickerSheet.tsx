'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { acceptInvitation } from '@/app/(admin)/admin/invitations/actions'
import type { Invitation, EventType } from '@/types'
import type { FormState } from '@/app/(admin)/admin/calendar/CreateEventSheet'

function mapEventType(invType: Invitation['event_type']): EventType {
  if (invType === 'festival') return 'festival'
  return 'event'
}

export function InvitationPickerSheet({
  open,
  onClose,
  currentUserEmail,
  onSelectInvitation,
}: {
  open: boolean
  onClose: () => void
  currentUserEmail: string
  onSelectInvitation: (prefill: Partial<FormState>) => void
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    setLoading(true)
    createClient()
      .from('invitations')
      .select('*')
      .in('status', ['new', 'reviewed'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInvitations((data as Invitation[]) ?? [])
        setLoading(false)
      })
  }, [open])

  function handleSelect(inv: Invitation) {
    const admissionNote = inv.is_free
      ? 'Free'
      : `Paid${inv.ticket_price ? ` — ${inv.ticket_price}` : ''}`
    const contactNote = `Invited by: ${inv.contact_name} <${inv.contact_email}>${inv.contact_phone ? ` · ${inv.contact_phone}` : ''}\nTickets: ${admissionNote}`

    const prefill: Partial<FormState> = {
      name: inv.event_name,
      event_type: mapEventType(inv.event_type),
      event_date: inv.event_date ?? '',
      venue_name: inv.venue_name ?? '',
      venue_location: inv.venue_location ?? '',
      description: [inv.description, inv.message].filter(Boolean).join('\n\n'),
      notes: contactNote,
    }

    // Mark invitation as accepted (fire-and-forget)
    startTransition(() => {
      acceptInvitation(inv.id, currentUserEmail)
    })

    // Optimistically remove from list
    setInvitations((prev) => prev.filter((x) => x.id !== inv.id))

    onSelectInvitation(prefill)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0a1628] border-white/10 text-white flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/8">
          <SheetTitle className="text-white text-lg font-bold">Pending Invitations</SheetTitle>
          <p className="text-xs text-white/40 mt-1">
            Click an invitation to pre-fill the Create Event form.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {loading && (
            <p className="text-white/40 text-sm text-center py-8">Loading…</p>
          )}
          {!loading && invitations.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">No pending invitations.</p>
          )}
          {invitations.map((inv) => (
            <button
              key={inv.id}
              onClick={() => handleSelect(inv)}
              className="w-full text-left p-4 rounded-xl bg-white/4 border border-white/8 hover:border-[#FAA21B]/40 hover:bg-white/8 transition-colors"
            >
              <p className="font-semibold text-white text-sm mb-1">{inv.event_name}</p>
              <p className="text-xs text-white/50">
                {inv.event_date
                  ? new Date(inv.event_date + 'T00:00:00').toLocaleDateString()
                  : 'Date TBD'}
                {inv.venue_name ? ` · ${inv.venue_name}` : ''}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {inv.is_free
                  ? 'Free'
                  : `Paid${inv.ticket_price ? ` — ${inv.ticket_price}` : ''}`}
                {' · '}
                From: {inv.contact_name}
              </p>
              <span
                className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border ${
                  inv.status === 'new'
                    ? 'bg-[#FAA21B]/10 border-[#FAA21B]/30 text-[#FAA21B]'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                {inv.status}
              </span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
