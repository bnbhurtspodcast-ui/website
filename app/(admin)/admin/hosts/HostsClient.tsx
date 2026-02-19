'use client'

import { Users, Plus, Pencil, Trash2, X, Link } from 'lucide-react'
import { useState, useRef } from 'react'
import type { Host } from '@/types'
import { createHost, updateHost, deleteHost } from '../actions'
import { createClient } from '@/lib/supabase/client'

type SocialLink = { platform: string; url: string }

type FormState = {
  name: string
  interests: string
  description: string
  social_links: SocialLink[]
}

const emptyForm: FormState = {
  name: '',
  interests: '',
  description: '',
  social_links: [],
}

async function uploadPhoto(file: File): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('host-photos').upload(fileName, file)
  if (error) {
    console.error('Photo upload error:', error)
    return null
  }
  const { data } = supabase.storage.from('host-photos').getPublicUrl(fileName)
  return data.publicUrl
}

export function HostsClient({ hosts }: { hosts: Host[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Host | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(host: Host) {
    setEditing(host)
    setForm({
      name: host.name,
      interests: host.interests ?? '',
      description: host.description ?? '',
      social_links: host.social_links ?? [],
    })
    setError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setError(null)
  }

  function addSocialLink() {
    setForm((f) => ({ ...f, social_links: [...f.social_links, { platform: '', url: '' }] }))
  }

  function removeSocialLink(i: number) {
    setForm((f) => ({ ...f, social_links: f.social_links.filter((_, idx) => idx !== i) }))
  }

  function updateSocialLink(i: number, field: 'platform' | 'url', value: string) {
    setForm((f) => {
      const links = [...f.social_links]
      links[i] = { ...links[i], [field]: value }
      return { ...f, social_links: links }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError(null)

    try {
      // Upload photo client-side first, then pass URL to server action
      let photo_url: string | undefined
      const file = fileRef.current?.files?.[0]
      if (file) {
        const url = await uploadPhoto(file)
        if (!url) { setError('Photo upload failed. Please try again.'); setLoading(false); return }
        photo_url = url
      }

      const payload = {
        name: form.name.trim(),
        interests: form.interests || null,
        description: form.description || null,
        social_links: form.social_links.filter((l) => l.platform && l.url),
        photo_url,
      }

      if (editing) {
        await updateHost(editing.id, payload)
      } else {
        await createHost(payload)
      }
      closeModal()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete host "${name}"? This cannot be undone.`)) return
    await deleteHost(id)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hosts</h1>
          <p className="text-[#FAA21B]">Manage podcast hosts displayed on the About page</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Host
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{hosts.length}</div>
          <div className="text-sm text-gray-600">Total Hosts</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {hosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">No hosts yet</p>
            <p className="text-sm mt-1">Click &quot;Add Host&quot; to create the first one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Photo', 'Name', 'Interests', 'Social Links', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hosts.map((host) => (
                  <tr key={host.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {host.photo_url ? (
                        <img
                          src={host.photo_url}
                          alt={host.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#FAA21B]/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#FAA21B]/10 flex items-center justify-center border-2 border-[#FAA21B]/30">
                          <Users className="h-5 w-5 text-[#FAA21B]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{host.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{host.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{host.interests || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {host.social_links?.length > 0
                        ? host.social_links.map((l) => l.platform).join(', ')
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(host)}
                          className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(host.id, host.name)}
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
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#112B4F]">
                {editing ? 'Edit Host' : 'Add Host'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#FAA21B] outline-none transition-colors"
                  placeholder="Host name"
                  required
                />
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                {editing?.photo_url && (
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={editing.photo_url}
                      alt="Current photo"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FAA21B]/30"
                    />
                    <span className="text-xs text-gray-500">Upload a new photo to replace</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FAA21B]/10 file:text-[#112B4F] hover:file:bg-[#FAA21B]/20 transition-all"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <input
                  type="text"
                  value={form.interests}
                  onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#FAA21B] outline-none transition-colors"
                  placeholder="e.g. EDM, Rave Culture, DJing"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#FAA21B] outline-none transition-colors resize-none"
                  placeholder="A short bio about this host..."
                />
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Social Links</label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-xs flex items-center gap-1 text-[#FAA21B] hover:text-[#FAA21B]/80 font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {form.social_links.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                        className="w-36 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#FAA21B] outline-none transition-colors bg-white"
                      >
                        <option value="">Platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="x">X</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#FAA21B] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(i)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {form.social_links.length === 0 && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Link className="h-3 w-3" /> No social links yet — click &quot;Add Link&quot;
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Host'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
