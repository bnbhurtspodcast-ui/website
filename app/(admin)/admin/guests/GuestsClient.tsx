'use client'

import { User, Search, Filter, Eye, CheckCircle, X, Star, Mail } from 'lucide-react'
import { useState } from 'react'
import type { GuestApplication } from '@/types'
import { updateGuestStatus } from '../actions'

const statusColor: Record<string, string> = {
  pending: 'bg-[#FAA21B] text-[#112B4F]',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  scheduled: 'bg-blue-500 text-white',
}

export function GuestsClient({ guests }: { guests: GuestApplication[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<GuestApplication | null>(null)

  const filtered = guests.filter((g) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.expertise.toLowerCase().includes(q)
    const matchFilter = filterStatus === 'all' || g.status === filterStatus
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Guest Applications</h1>
        <p className="text-[#FAA21B]">Review and manage potential podcast guests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{guests.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-[#FAA21B]/10 rounded-xl p-4 shadow">
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
                {['Name', 'Expertise', 'Topic Idea', 'Date Applied', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(g)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateGuestStatus(g.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateGuestStatus(g.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
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

            <div className="flex gap-3">
              <button
                onClick={() => { updateGuestStatus(selected.id, 'approved'); setSelected(null) }}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={() => { updateGuestStatus(selected.id, 'scheduled'); setSelected(null) }}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Star className="h-4 w-4" /> Schedule
              </button>
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" /> Reply
              </a>
              <button
                onClick={() => { updateGuestStatus(selected.id, 'rejected'); setSelected(null) }}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
