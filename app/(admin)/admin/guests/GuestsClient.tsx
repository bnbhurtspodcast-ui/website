'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User, Search, Filter, Eye, Trash2, X, RefreshCw } from 'lucide-react'
import type { GuestApplication } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateGuestStatus, reviewGuestApplication, deleteGuestApplication } from '@/app/(admin)/admin/actions'

const statusColor: Record<string, string> = {
  pending:   'admin-badge admin-badge-pending',
  reviewing: 'admin-badge admin-badge-reviewing',
  approved:  'admin-badge admin-badge-approved',
  rejected:  'admin-badge admin-badge-rejected',
  scheduled: 'admin-badge admin-badge-scheduled',
}

export function GuestsClient({ guests: initialGuests }: { guests: GuestApplication[] }) {
  const [guests, setGuests] = useState<GuestApplication[]>(initialGuests)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<GuestApplication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GuestApplication | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUser(data.user?.email ?? '')
    })
  }, [])

  const filtered = guests.filter((g) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.expertise.toLowerCase().includes(q)
    const matchFilter = filterStatus === 'all' || g.status === filterStatus
    return matchSearch && matchFilter
  })

  function openModal(g: GuestApplication) {
    let updated = g
    if (g.status === 'pending') {
      updated = { ...g, status: 'reviewing', reviewed_by: currentUser }
      setGuests((prev) => prev.map((x) => (x.id === g.id ? updated : x)))
      reviewGuestApplication(g.id, currentUser)
    }
    setSelected(updated)
  }

  function handleStatusChange(newStatus: GuestApplication['status']) {
    if (!selected) return
    const updated = { ...selected, status: newStatus, reviewed_by: currentUser }
    setSelected(updated)
    setGuests((prev) => prev.map((x) => (x.id === selected.id ? updated : x)))
    updateGuestStatus(selected.id, newStatus, currentUser)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setGuests((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    if (selected?.id === deleteTarget.id) setSelected(null)
    deleteGuestApplication(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Guest Applications</h1>
          <p className="text-sm text-white/45">Review and manage potential podcast guests</p>
        </div>
        <button
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          aria-label="Refresh submissions"
          className="admin-btn-ghost flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${isPending ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="admin-card p-4 border-l-2 border-l-white/20">
          <div className="text-2xl font-black text-white">{guests.length}</div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Total</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-[#FAA21B]">
          <div className="text-2xl font-black text-[#FAA21B]">
            {guests.filter((g) => g.status === 'pending').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Pending</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-emerald-400/70">
          <div className="text-2xl font-black text-emerald-400">
            {guests.filter((g) => g.status === 'approved').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Approved</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-blue-400/70">
          <div className="text-2xl font-black text-blue-400">
            {guests.filter((g) => g.status === 'scheduled').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Scheduled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name, email, or expertise…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search applications"
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
              className="admin-input px-4 py-2 w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Guest applications">
            <thead className="admin-table-header">
              <tr>
                {['Name', 'Expertise', 'Topic Idea', 'Date Applied', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody aria-live="polite">
              {filtered.map((g) => (
                <tr
                  key={g.id}
                  className="admin-table-row cursor-pointer"
                  onClick={() => openModal(g)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="size-9 bg-[#FAA21B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="size-4 text-[#FAA21B]" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/85">{g.name}</div>
                        <div className="text-xs text-white/40">{g.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-white/80">{g.expertise}</td>
                  <td className="text-white/80 max-w-xs truncate">{g.topic_idea}</td>
                  <td className="text-white/40">{new Date(g.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusColor[g.status] ?? 'admin-badge'}>
                      {g.status}
                    </span>
                  </td>
                  <td className="text-white/55">{g.reviewed_by ?? '—'}</td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(g)}
                        aria-label={`View application from ${g.name}`}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(g)}
                        aria-label={`Delete application from ${g.name}`}
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
                  <td colSpan={7} className="text-center py-12 text-white/30">No applications match your filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-modal-title"
            className="admin-modal p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-[#FAA21B]/10 rounded-full flex items-center justify-center border border-[#FAA21B]/20">
                  <User className="size-7 text-[#FAA21B]" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="guest-modal-title" className="text-2xl font-bold text-white">{selected.name}</h2>
                  <p className="text-sm text-white/50">{selected.expertise}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="admin-label">Email</label>
                <p className="text-white/80 text-sm">{selected.email}</p>
              </div>
              {selected.social_media && (
                <div>
                  <label className="admin-label">Social Media</label>
                  <p className="text-white/80 text-sm">{selected.social_media}</p>
                </div>
              )}
              <div>
                <label className="admin-label">Applied</label>
                <p className="text-white/80 text-sm">{new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
              {selected.availability && (
                <div>
                  <label className="admin-label">Availability</label>
                  <p className="text-white/80 text-sm">{selected.availability}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="admin-label">Proposed Topic</label>
                <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed">{selected.topic_idea}</p>
              </div>
              <div>
                <label className="admin-label">Bio</label>
                <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed">{selected.bio}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/8">
              <div className="flex-1">
                <label className="admin-label" htmlFor="guest-status-select">Status</label>
                <select
                  id="guest-status-select"
                  value={selected.status}
                  onChange={(e) => handleStatusChange(e.target.value as GuestApplication['status'])}
                  aria-label="Update status"
                  className="admin-input text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="admin-label">Reviewed by</label>
                <p className="text-sm text-white/60">{selected.reviewed_by ?? '—'}</p>
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
            <h2 id="delete-modal-title" className="text-xl font-bold text-white mb-2">Delete Application</h2>
            <p className="text-white/55 mb-6">
              Are you sure you want to delete the application from{' '}
              <span className="font-semibold text-white/80">{deleteTarget.name}</span>? This cannot be undone.
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
