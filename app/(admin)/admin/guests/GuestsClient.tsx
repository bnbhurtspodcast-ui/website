'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User, Search, Filter, Eye, Trash2, X, RefreshCw } from 'lucide-react'
import type { GuestApplication } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateGuestStatus, reviewGuestApplication, deleteGuestApplication } from '../actions'

const statusColor: Record<string, string> = {
  pending: 'bg-[#FAA21B] text-[#112B4F]',
  reviewing: 'bg-gray-400 text-white',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  scheduled: 'bg-blue-500 text-white',
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
          <h1 className="text-3xl font-bold text-white mb-2">Guest Applications</h1>
          <p className="text-[#FAA21B]">Review and manage potential podcast guests</p>
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
          <div className="text-2xl font-bold text-[#112B4F]">{guests.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">
            {guests.filter((g) => g.status === 'pending').length}
          </div>
          <div className="text-sm text-[#112B4F]">Pending Review</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">
            {guests.filter((g) => g.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">
            {guests.filter((g) => g.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or expertise..."
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Expertise', 'Topic Idea', 'Date Applied', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(g)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAA21B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-[#FAA21B]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{g.name}</div>
                        <div className="text-xs text-gray-500">{g.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{g.expertise}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{g.topic_idea}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(g.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusColor[g.status] ?? 'bg-gray-200 text-gray-700'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.reviewed_by ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(g)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(g)}
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
                <div className="w-16 h-16 bg-[#FAA21B]/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#FAA21B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#112B4F]">{selected.name}</h2>
                  <p className="text-gray-600">{selected.expertise}</p>
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
              {selected.social_media && <div><label className="text-sm font-medium text-gray-600 block mb-1">Social Media</label><p className="text-gray-900">{selected.social_media}</p></div>}
              <div><label className="text-sm font-medium text-gray-600 block mb-1">Applied</label><p className="text-gray-900">{new Date(selected.created_at).toLocaleDateString()}</p></div>
              {selected.availability && <div><label className="text-sm font-medium text-gray-600 block mb-1">Availability</label><p className="text-gray-900">{selected.availability}</p></div>}
            </div>

            <div className="space-y-4 mb-6">
              <div><label className="text-sm font-medium text-gray-600 block mb-2">Proposed Topic</label><p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selected.topic_idea}</p></div>
              <div><label className="text-sm font-medium text-gray-600 block mb-2">Bio</label><p className="text-gray-900 bg-gray-50 p-4 rounded-lg leading-relaxed">{selected.bio}</p></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(e.target.value as GuestApplication['status'])}
                  className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none transition-all text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="rejected">Rejected</option>
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
            <h2 className="text-xl font-bold text-[#112B4F] mb-2">Delete Application</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the application from <span className="font-semibold">{deleteTarget.name}</span>? This cannot be undone.
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
