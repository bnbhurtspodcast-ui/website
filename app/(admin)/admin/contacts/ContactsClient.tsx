'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Trash2, X, RefreshCw } from 'lucide-react'
import type { ContactSubmission } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateContactStatus, deleteContactSubmission, reviewContactSubmission } from '../actions'

const statusColor: Record<string, string> = {
  new: 'admin-badge admin-badge-new',
  reviewed: 'admin-badge admin-badge-reviewed',
  responded: 'admin-badge admin-badge-responded',
}

export function ContactsClient({ contacts: initialContacts }: { contacts: ContactSubmission[] }) {
  const [contacts, setContacts] = useState<ContactSubmission[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUser(data.user?.email ?? '')
    })
  }, [])

  const filtered = contacts.filter((c) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q)
    const matchFilter = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchFilter
  })

  function openModal(c: ContactSubmission) {
    let updated = c
    if (c.status === 'new') {
      updated = { ...c, status: 'reviewed', reviewed_by: currentUser }
      setContacts((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
      reviewContactSubmission(c.id, currentUser)
    }
    setSelected(updated)
  }

  function handleStatusChange(newStatus: ContactSubmission['status']) {
    if (!selected) return
    const updated = { ...selected, status: newStatus, reviewed_by: currentUser }
    setSelected(updated)
    setContacts((prev) => prev.map((x) => (x.id === selected.id ? updated : x)))
    updateContactStatus(selected.id, newStatus, currentUser)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setContacts((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    if (selected?.id === deleteTarget.id) setSelected(null)
    deleteContactSubmission(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Contact Submissions</h1>
          <p className="text-sm text-white/45">Manage and respond to contact form submissions</p>
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
          <div className="text-2xl font-black text-white">{contacts.length}</div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Total</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-[#FAA21B]">
          <div className="text-2xl font-black text-[#FAA21B]">
            {contacts.filter((c) => c.status === 'new').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">New</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-blue-400/70">
          <div className="text-2xl font-black text-blue-400">
            {contacts.filter((c) => c.status === 'reviewed').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Reviewed</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-emerald-400/70">
          <div className="text-2xl font-black text-emerald-400">
            {contacts.filter((c) => c.status === 'responded').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Responded</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name, email, or subject…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search submissions"
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
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Contact submissions">
            <thead className="admin-table-header">
              <tr>
                {['Name', 'Email', 'Subject', 'Date', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody aria-live="polite">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="admin-table-row cursor-pointer"
                  onClick={() => openModal(c)}
                >
                  <td className="font-medium text-white/85">{c.name}</td>
                  <td className="text-white/55">{c.email}</td>
                  <td className="text-white/80 max-w-xs truncate">{c.subject}</td>
                  <td className="text-white/40">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusColor[c.status] ?? 'admin-badge'}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-white/55 max-w-xs truncate">{c.reviewed_by}</td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(c)}
                        aria-label={`View submission from ${c.name}`}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        aria-label={`Delete submission from ${c.name}`}
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
                  <td colSpan={7} className="text-center py-12 text-white/30">No submissions match your filter.</td>
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
            aria-labelledby="contact-modal-title"
            className="admin-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="contact-modal-title" className="text-2xl font-bold text-white mb-1">{selected.subject}</h2>
                <p className="text-sm text-white/50">From: {selected.name}</p>
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
              <div>
                <label className="admin-label">Email</label>
                <p className="text-white/80 text-sm">{selected.email}</p>
              </div>
              <div>
                <label className="admin-label">Message</label>
                <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed">{selected.message}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/8">
                <div className="flex-1">
                  <label className="admin-label" htmlFor="contact-status-select">Status</label>
                  <select
                    id="contact-status-select"
                    value={selected.status}
                    onChange={(e) => handleStatusChange(e.target.value as ContactSubmission['status'])}
                    aria-label="Update status"
                    className="admin-input text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
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
            <h2 id="delete-modal-title" className="text-xl font-bold text-white mb-2">Delete Submission</h2>
            <p className="text-white/55 mb-6">
              Are you sure you want to delete the submission from{' '}
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
