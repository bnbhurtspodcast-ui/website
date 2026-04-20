'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Trash2, X, RefreshCw, CalendarDays, MapPin, Ticket, Phone, Mail } from 'lucide-react'
import type { Invitation } from '@/types'
import { createClient } from '@/lib/supabase/client'
import {
  updateInvitationStatus,
  deleteInvitation,
  reviewInvitation,
} from '@/app/(admin)/admin/invitations/actions'

const statusColor: Record<string, string> = {
  new: 'admin-badge admin-badge-new',
  reviewed: 'admin-badge admin-badge-reviewed',
  accepted: 'admin-badge admin-badge-approved',
  declined: 'admin-badge admin-badge-rejected',
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  event: 'Event',
  festival: 'Festival',
  concert: 'Concert',
  club_night: 'Club Night',
  other: 'Other',
}

export function InvitationsClient({ invitations: initialInvitations }: { invitations: Invitation[] }) {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<Invitation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Invitation | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUser(data.user?.email ?? '')
    })
  }, [])

  const filtered = invitations.filter((inv) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      inv.event_name.toLowerCase().includes(q) ||
      inv.contact_name.toLowerCase().includes(q) ||
      inv.contact_email.toLowerCase().includes(q)
    const matchFilter = filterStatus === 'all' || inv.status === filterStatus
    return matchSearch && matchFilter
  })

  function openModal(inv: Invitation) {
    let updated = inv
    if (inv.status === 'new') {
      updated = { ...inv, status: 'reviewed', reviewed_by: currentUser }
      setInvitations((prev) => prev.map((x) => (x.id === inv.id ? updated : x)))
      reviewInvitation(inv.id, currentUser)
    }
    setSelected(updated)
  }

  function handleStatusChange(newStatus: Invitation['status']) {
    if (!selected) return
    const updated = { ...selected, status: newStatus, reviewed_by: currentUser }
    setSelected(updated)
    setInvitations((prev) => prev.map((x) => (x.id === selected.id ? updated : x)))
    updateInvitationStatus(selected.id, newStatus, currentUser)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setInvitations((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    if (selected?.id === deleteTarget.id) setSelected(null)
    deleteInvitation(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Show Invitations</h1>
          <p className="text-sm text-white/45">Event invitations sent by promoters and organizers</p>
        </div>
        <button
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          aria-label="Refresh invitations"
          className="admin-btn-ghost flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${isPending ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="admin-card p-3 md:p-4 border-l-2 border-l-white/20">
          <div className="text-xl md:text-2xl font-black text-white">{invitations.length}</div>
          <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-wide mt-0.5">Total</div>
        </div>
        <div className="admin-card p-3 md:p-4 border-l-2 border-l-[#FAA21B]">
          <div className="text-xl md:text-2xl font-black text-[#FAA21B]">
            {invitations.filter((i) => i.status === 'new').length}
          </div>
          <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-wide mt-0.5">New</div>
        </div>
        <div className="admin-card p-3 md:p-4 border-l-2 border-l-blue-400/70">
          <div className="text-xl md:text-2xl font-black text-blue-400">
            {invitations.filter((i) => i.status === 'reviewed').length}
          </div>
          <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-wide mt-0.5">Reviewed</div>
        </div>
        <div className="admin-card p-3 md:p-4 border-l-2 border-l-emerald-400/70">
          <div className="text-xl md:text-2xl font-black text-emerald-400">
            {invitations.filter((i) => i.status === 'accepted').length}
          </div>
          <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-wide mt-0.5">Accepted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mb-6">
        <div className="flex flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by event, contact, or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search invitations"
              autoComplete="off"
              className="admin-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-white/30 flex-shrink-0" aria-hidden="true" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
              className="admin-input pr-4 pl-2 py-2 md:w-auto w-[65px]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Show invitations">
            <thead className="admin-table-header">
              <tr>
                {['Event Name', 'Contact', 'Event Date', 'Type', 'Free?', 'Submitted', 'Status', 'Actions'].map((h) => (
                  <th key={h} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody aria-live="polite">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="admin-table-row cursor-pointer"
                  onClick={() => openModal(inv)}
                >
                  <td className="font-medium text-white/85">{inv.event_name}</td>
                  <td className="text-white/55">
                    <div>{inv.contact_name}</div>
                    <div className="text-xs text-white/35">{inv.contact_email}</div>
                  </td>
                  <td className="text-white/40">
                    {inv.event_date ? new Date(inv.event_date + 'T00:00:00').toLocaleDateString() : '—'}
                  </td>
                  <td className="text-white/60">{EVENT_TYPE_LABELS[inv.event_type] ?? inv.event_type}</td>
                  <td>
                    {inv.is_free ? (
                      <span className="text-xs text-emerald-400 font-medium">Free</span>
                    ) : (
                      <span className="text-xs text-white/50">Paid{inv.ticket_price ? ` · ${inv.ticket_price}` : ''}</span>
                    )}
                  </td>
                  <td className="text-white/40">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusColor[inv.status] ?? 'admin-badge'}>{inv.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(inv)}
                        aria-label={`View invitation for ${inv.event_name}`}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inv)}
                        aria-label={`Delete invitation for ${inv.event_name}`}
                        className="p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-white/30">
                    No invitations match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invitation-modal-title"
            className="admin-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="invitation-modal-title" className="text-2xl font-bold text-white mb-1">
                  {selected.event_name}
                </h2>
                <p className="text-sm text-white/50">
                  {EVENT_TYPE_LABELS[selected.event_type]} · Invited by {selected.contact_name}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Event details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <CalendarDays className="size-3" />
                    Event Date
                  </label>
                  <p className="text-white/80 text-sm">
                    {selected.event_date
                      ? new Date(selected.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'TBD'}
                  </p>
                </div>
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <Ticket className="size-3" />
                    Admission
                  </label>
                  <p className="text-white/80 text-sm">
                    {selected.is_free
                      ? 'Free'
                      : `Paid${selected.ticket_price ? ` — ${selected.ticket_price}` : ''}`}
                  </p>
                </div>
              </div>

              {(selected.venue_name || selected.venue_location) && (
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <MapPin className="size-3" />
                    Venue
                  </label>
                  <p className="text-white/80 text-sm">
                    {[selected.venue_name, selected.venue_location].filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}

              {selected.description && (
                <div>
                  <label className="admin-label">Description</label>
                  <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                    {selected.description}
                  </p>
                </div>
              )}

              {selected.message && (
                <div>
                  <label className="admin-label">Message / Notes</label>
                  <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Contact info */}
              <div className="pt-3 border-t border-white/8">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Mail className="size-3.5 text-white/30 flex-shrink-0" />
                    <a href={`mailto:${selected.contact_email}`} className="hover:text-[#FAA21B] transition-colors">
                      {selected.contact_email}
                    </a>
                  </div>
                  {selected.contact_phone && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Phone className="size-3.5 text-white/30 flex-shrink-0" />
                      <span>{selected.contact_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/8">
                <div className="flex-1">
                  <label className="admin-label" htmlFor="invitation-status-select">Status</label>
                  <select
                    id="invitation-status-select"
                    value={selected.status}
                    onChange={(e) => handleStatusChange(e.target.value as Invitation['status'])}
                    aria-label="Update status"
                    className="admin-input text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="admin-label">Reviewed by</label>
                  <p className="text-sm text-white/60">{selected.reviewed_by ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="admin-modal p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-modal-title" className="text-xl font-bold text-white mb-2">
              Delete Invitation
            </h2>
            <p className="text-white/55 mb-6">
              Are you sure you want to delete the invitation for{' '}
              <span className="font-semibold text-white/80">{deleteTarget.event_name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-6 py-3 admin-btn-ghost rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-500/90 text-white rounded-lg font-semibold hover:bg-red-500 transition-colors border border-red-500/50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
