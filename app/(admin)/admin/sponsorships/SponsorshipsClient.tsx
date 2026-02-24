'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Search, Filter, Eye, Trash2, X, DollarSign, RefreshCw } from 'lucide-react'
import type { SponsorshipInquiry } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateSponsorshipStatus, reviewSponsorshipInquiry, deleteSponsorshipInquiry } from '../actions'

const statusColor: Record<string, string> = {
  new:         'admin-badge admin-badge-new',
  reviewing:   'admin-badge admin-badge-reviewing',
  negotiating: 'admin-badge admin-badge-negotiating',
  accepted:    'admin-badge admin-badge-accepted',
  declined:    'admin-badge admin-badge-declined',
}

const budgetLabel: Record<string, string> = {
  'under-1k': '< $1K',
  '1k-5k': '$1K–$5K',
  '5k-10k': '$5K–$10K',
  'over-10k': '> $10K',
}

export function SponsorshipsClient({ sponsorships: initialSponsorships }: { sponsorships: SponsorshipInquiry[] }) {
  const [sponsorships, setSponsorships] = useState<SponsorshipInquiry[]>(initialSponsorships)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<SponsorshipInquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SponsorshipInquiry | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUser(data.user?.email ?? '')
    })
  }, [])

  const filtered = sponsorships.filter((s) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      s.company_name.toLowerCase().includes(q) ||
      s.contact_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    const matchFilter = filterStatus === 'all' || s.status === filterStatus
    return matchSearch && matchFilter
  })

  function openModal(s: SponsorshipInquiry) {
    let updated = s
    if (s.status === 'new') {
      updated = { ...s, status: 'reviewing', reviewed_by: currentUser }
      setSponsorships((prev) => prev.map((x) => (x.id === s.id ? updated : x)))
      reviewSponsorshipInquiry(s.id, currentUser)
    }
    setSelected(updated)
  }

  function handleStatusChange(newStatus: SponsorshipInquiry['status']) {
    if (!selected) return
    const updated = { ...selected, status: newStatus, reviewed_by: currentUser }
    setSelected(updated)
    setSponsorships((prev) => prev.map((x) => (x.id === selected.id ? updated : x)))
    updateSponsorshipStatus(selected.id, newStatus, currentUser)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setSponsorships((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    if (selected?.id === deleteTarget.id) setSelected(null)
    deleteSponsorshipInquiry(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Sponsorship Inquiries</h1>
          <p className="text-sm text-white/45">Manage and track sponsorship opportunities</p>
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
          <div className="text-2xl font-black text-white">{sponsorships.length}</div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Total</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-[#FAA21B]">
          <div className="text-2xl font-black text-[#FAA21B]">
            {sponsorships.filter((s) => s.status === 'new').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">New</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-violet-400/70">
          <div className="text-2xl font-black text-violet-400">
            {sponsorships.filter((s) => s.status === 'negotiating').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Negotiating</div>
        </div>
        <div className="admin-card p-4 border-l-2 border-l-emerald-400/70">
          <div className="text-2xl font-black text-emerald-400">
            {sponsorships.filter((s) => s.status === 'accepted').length}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Accepted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by company, contact, or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search sponsorships"
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
              <option value="reviewing">Reviewing</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Sponsorship inquiries">
            <thead className="admin-table-header">
              <tr>
                {['Company', 'Contact', 'Package', 'Budget', 'Date', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody aria-live="polite">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="admin-table-row cursor-pointer"
                  onClick={() => openModal(s)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="size-9 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="size-4 text-emerald-400" aria-hidden="true" />
                      </div>
                      <div className="text-sm font-medium text-white/85">{s.company_name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-white/80">{s.contact_name}</div>
                    <div className="text-xs text-white/40">{s.email}</div>
                  </td>
                  <td>
                    {s.package_interest && (
                      <span className="inline-flex px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded text-xs font-medium">
                        {s.package_interest}
                      </span>
                    )}
                  </td>
                  <td>
                    {s.budget && (
                      <div className="flex items-center gap-1 text-sm font-medium text-white/80">
                        <DollarSign className="size-3.5 text-emerald-400" aria-hidden="true" />
                        {budgetLabel[s.budget] ?? s.budget}
                      </div>
                    )}
                  </td>
                  <td className="text-white/40">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusColor[s.status] ?? 'admin-badge'}>
                      {s.status}
                    </span>
                  </td>
                  <td className="text-white/55">{s.reviewed_by ?? '—'}</td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(s)}
                        aria-label={`View inquiry from ${s.company_name}`}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        aria-label={`Delete inquiry from ${s.company_name}`}
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
                  <td colSpan={8} className="text-center py-12 text-white/30">No inquiries match your filter.</td>
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
            aria-labelledby="sponsorship-modal-title"
            className="admin-modal p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <Briefcase className="size-7 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="sponsorship-modal-title" className="text-2xl font-bold text-white">{selected.company_name}</h2>
                  <p className="text-sm text-white/50">{selected.contact_name}</p>
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
              <div>
                <label className="admin-label">Date</label>
                <p className="text-white/80 text-sm">{new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
              {selected.package_interest && (
                <div>
                  <label className="admin-label">Package</label>
                  <span className="inline-flex px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded font-medium text-sm">
                    {selected.package_interest}
                  </span>
                </div>
              )}
              {selected.budget && (
                <div>
                  <label className="admin-label">Budget</label>
                  <p className="text-white/80 text-sm font-medium flex items-center gap-1">
                    <DollarSign className="size-4 text-emerald-400" aria-hidden="true" />
                    {budgetLabel[selected.budget] ?? selected.budget}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="admin-label">Campaign Goals</label>
                <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed">{selected.goals}</p>
              </div>
              {selected.message && (
                <div>
                  <label className="admin-label">Message</label>
                  <p className="text-white/75 text-sm bg-white/4 border border-white/8 p-4 rounded-lg leading-relaxed">{selected.message}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/8">
              <div className="flex-1">
                <label className="admin-label" htmlFor="sponsorship-status-select">Status</label>
                <select
                  id="sponsorship-status-select"
                  value={selected.status}
                  onChange={(e) => handleStatusChange(e.target.value as SponsorshipInquiry['status'])}
                  aria-label="Update status"
                  className="admin-input text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="negotiating">Negotiating</option>
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
            <h2 id="delete-modal-title" className="text-xl font-bold text-white mb-2">Delete Inquiry</h2>
            <p className="text-white/55 mb-6">
              Are you sure you want to delete the inquiry from{' '}
              <span className="font-semibold text-white/80">{deleteTarget.company_name}</span>? This cannot be undone.
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
