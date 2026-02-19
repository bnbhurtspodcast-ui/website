'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Trash2, X, RefreshCw } from 'lucide-react'
import type { ContactSubmission } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { updateContactStatus, deleteContactSubmission, reviewContactSubmission } from '../actions'

const statusColor: Record<string, string> = {
  new: 'bg-[#FAA21B] text-[#112B4F]',
  reviewed: 'bg-blue-500 text-white',
  responded: 'bg-green-500 text-white',
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
          <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions</h1>
          <p className="text-[#FAA21B]">Manage and respond to contact form submissions</p>
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
          <div className="text-2xl font-bold text-[#112B4F]">{contacts.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">
            {contacts.filter((c) => c.status === 'new').length}
          </div>
          <div className="text-sm text-[#112B4F]">New</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">
            {contacts.filter((c) => c.status === 'reviewed').length}
          </div>
          <div className="text-sm text-gray-600">Reviewed</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">
            {contacts.filter((c) => c.status === 'responded').length}
          </div>
          <div className="text-sm text-gray-600">Responded</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
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
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
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
                {['Name', 'Email', 'Subject', 'Date', 'Status', 'Reviewed By', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(c)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusColor[c.status] ?? 'bg-gray-200 text-gray-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.reviewed_by}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(c)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
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
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#112B4F] mb-2">{selected.subject}</h2>
                <p className="text-gray-600">From: {selected.name}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selected.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Message</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selected.message}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusChange(e.target.value as ContactSubmission['status'])}
                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none transition-all text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Reviewed by</label>
                  <p className="text-sm text-gray-700">{selected.reviewed_by ?? '—'}</p>
                </div>
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
            <h2 className="text-xl font-bold text-[#112B4F] mb-2">Delete Submission</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the submission from <span className="font-semibold">{deleteTarget.name}</span>? This cannot be undone.
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
