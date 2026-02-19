'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Search, Filter, Eye, Trash2, X, DollarSign, RefreshCw } from 'lucide-react'
import type { SponsorshipInquiry } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateSponsorshipStatus, reviewSponsorshipInquiry, deleteSponsorshipInquiry } from '../actions'

const statusColor: Record<string, string> = {
  new: 'bg-[#FAA21B] text-[#112B4F]',
  reviewing: 'bg-blue-500 text-white',
  negotiating: 'bg-purple-500 text-white',
  accepted: 'bg-green-500 text-white',
  declined: 'bg-red-500 text-white',
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
          <h1 className="text-3xl font-bold text-white mb-2">Sponsorship Inquiries</h1>
          <p className="text-[#FAA21B]">Manage and track sponsorship opportunities</p>
        </div>
        <button
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#112B4F] rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{sponsorships.length}</div>
          <div className="text-sm text-gray-600">Total Inquiries</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">
            {sponsorships.filter((s) => s.status === 'new').length}
          </div>
          <div className="text-sm text-[#112B4F]">New</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-purple-600">
            {sponsorships.filter((s) => s.status === 'negotiating').length}
          </div>
          <div className="text-sm text-gray-600">Negotiating</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">
            {sponsorships.filter((s) => s.status === 'accepted').length}
          </div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none transition-all"
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Company', 'Contact', 'Package', 'Budget', 'Date', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(s)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{s.company_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{s.contact_name}</div>
                    <div className="text-xs text-gray-500">{s.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {s.package_interest && (
                      <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {s.package_interest}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {s.budget && (
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        {budgetLabel[s.budget] ?? s.budget}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusColor[s.status] ?? 'bg-gray-200 text-gray-700'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.reviewed_by ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(s)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#112B4F]">{selected.company_name}</h2>
                  <p className="text-gray-600">{selected.contact_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div><label className="text-sm font-medium text-gray-600 block mb-1">Email</label><p className="text-gray-900">{selected.email}</p></div>
              <div><label className="text-sm font-medium text-gray-600 block mb-1">Date</label><p className="text-gray-900">{new Date(selected.created_at).toLocaleDateString()}</p></div>
              {selected.package_interest && <div><label className="text-sm font-medium text-gray-600 block mb-1">Package</label><span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded font-medium text-sm">{selected.package_interest}</span></div>}
              {selected.budget && <div><label className="text-sm font-medium text-gray-600 block mb-1">Budget</label><p className="text-gray-900 font-medium flex items-center gap-1"><DollarSign className="h-4 w-4 text-green-600" />{budgetLabel[selected.budget] ?? selected.budget}</p></div>}
            </div>

            <div className="space-y-4 mb-6">
              <div><label className="text-sm font-medium text-gray-600 block mb-2">Campaign Goals</label><p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selected.goals}</p></div>
              {selected.message && <div><label className="text-sm font-medium text-gray-600 block mb-2">Message</label><p className="text-gray-900 bg-gray-50 p-4 rounded-lg leading-relaxed">{selected.message}</p></div>}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(e.target.value as SponsorshipInquiry['status'])}
                  className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none transition-all text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">Reviewed by</label>
                <p className="text-sm text-gray-700">{selected.reviewed_by ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#112B4F] mb-2">Delete Inquiry</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the inquiry from <span className="font-semibold">{deleteTarget.company_name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
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
