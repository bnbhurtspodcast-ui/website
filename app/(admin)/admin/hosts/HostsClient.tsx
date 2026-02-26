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
  user_id: string        // only used on create; immutable after
  role: 'host' | 'team'
}

const emptyForm: FormState = {
  name: '',
  interests: '',
  description: '',
  social_links: [],
  user_id: '',
  role: 'host',
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

export function HostsClient({
  hosts,
  users,
}: {
  hosts: Host[]
  users: { id: string; email: string; name: string }[]
}) {
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
      user_id: '',    // not editable on update
      role: host.role,
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
    if (!editing && !form.user_id) { setError('Please select a linked user account'); return }
    setLoading(true)
    setError(null)

    try {
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
        role: form.role,
        ...(!editing && { user_id: form.user_id }),
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

  // Resolve a user_id to display string for edit form
  function linkedUserLabel(userId: string | null | undefined) {
    if (!userId) return 'None linked'
    const u = users.find((u) => u.id === userId)
    return u ? `${u.name} (${u.email})` : userId
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Hosts</h1>
          <p className="text-sm text-white/45">Manage podcast hosts displayed on the About page</p>
        </div>
        <button
          onClick={openAdd}
          className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Host
        </button>
      </div>

      {/* Stat */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs">
        <div className="admin-card p-4">
          <div className="text-2xl font-black text-white">{hosts.length}</div>
          <div className="text-sm text-white/40">Total Hosts</div>
        </div>
      </div>

      {/* Grid / Empty state */}
      {hosts.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-20" role="status">
          <Users className="size-12 mb-4 text-white/15" aria-hidden="true" />
          <p className="font-medium text-white/40">No hosts yet</p>
          <p className="text-sm mt-1 text-white/25">Click &quot;Add Host&quot; to create the first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hosts.map((host) => (
            <div key={host.id} className="admin-card p-5 flex flex-col items-center text-center group">
              {/* Photo */}
              <div className="relative mb-4">
                {host.photo_url ? (
                  <img
                    src={host.photo_url}
                    alt={host.name}
                    className="size-20 rounded-full object-cover ring-2 ring-[#FAA21B]/30 group-hover:ring-[#FAA21B]/60 transition-all"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-[#FAA21B]/10 flex items-center justify-center ring-2 ring-[#FAA21B]/20" aria-hidden="true">
                    <Users className="size-8 text-[#FAA21B]/60" />
                  </div>
                )}
              </div>

              <h3 className="text-white font-semibold text-base mb-1">{host.name}</h3>

              {/* Role badge */}
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 ${
                host.role === 'host'
                  ? 'bg-[#FAA21B]/15 text-[#FAA21B]/80'
                  : 'bg-white/8 text-white/40'
              }`}>
                {host.role}
              </span>

              {host.interests && (
                <p className="text-xs text-[#FAA21B]/70 mb-2 font-medium">{host.interests}</p>
              )}

              {host.description && (
                <p className="text-xs text-white/40 line-clamp-2 mb-4 leading-relaxed">{host.description}</p>
              )}

              {host.social_links?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {host.social_links.map((l) => (
                    <a
                      key={l.platform}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${host.name} on ${l.platform}`}
                      className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 text-white/50 rounded-full hover:border-[#FAA21B]/40 hover:text-[#FAA21B]/70 transition-colors capitalize"
                    >
                      {l.platform}
                    </a>
                  ))}
                </div>
              )}

              <div className="admin-gold-line w-full mb-4" aria-hidden="true" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(host)}
                  aria-label={`Edit ${host.name}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#FAA21B] bg-[#FAA21B]/8 hover:bg-[#FAA21B]/15 border border-[#FAA21B]/20 rounded-lg transition-colors"
                >
                  <Pencil className="size-3" aria-hidden="true" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(host.id, host.name)}
                  aria-label={`Delete ${host.name}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-red-500/15 rounded-lg transition-colors"
                >
                  <Trash2 className="size-3" aria-hidden="true" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="host-modal-title"
            className="admin-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="host-modal-title" className="text-2xl font-bold text-white">
                {editing ? 'Edit Host' : 'Add Host'}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/8 rounded-lg transition-colors"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="admin-label" htmlFor="host-name">
                  Name <span className="text-[#FAA21B]">*</span>
                </label>
                <input
                  id="host-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="admin-input"
                  placeholder="Host name"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Linked User Account */}
              {!editing ? (
                <div>
                  <label className="admin-label" htmlFor="host-user">
                    Linked User Account <span className="text-[#FAA21B]">*</span>
                  </label>
                  <select
                    id="host-user"
                    value={form.user_id}
                    onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
                    className="admin-input"
                    required
                  >
                    <option value="">Select a user…</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id} className="bg-[#08111e]">
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="admin-label">Linked User Account</label>
                  <p className="admin-input text-white/50 cursor-not-allowed select-none py-2.5">
                    {linkedUserLabel(editing.user_id)}
                  </p>
                  <p className="text-xs text-white/30 mt-1">User account cannot be changed after creation.</p>
                </div>
              )}

              {/* Role */}
              <div>
                <label className="admin-label" htmlFor="host-role">Role</label>
                <select
                  id="host-role"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'host' | 'team' }))}
                  className="admin-input"
                >
                  <option value="host" className="bg-[#08111e]">Host — shown on public About page</option>
                  <option value="team" className="bg-[#08111e]">Team — internal only</option>
                </select>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="admin-label" htmlFor="host-photo">Profile Photo</label>
                {editing?.photo_url && (
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={editing.photo_url}
                      alt="Current photo"
                      className="size-14 rounded-full object-cover ring-2 ring-[#FAA21B]/30"
                    />
                    <span className="text-xs text-white/35">Upload a new photo to replace</span>
                  </div>
                )}
                <input
                  id="host-photo"
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FAA21B]/12 file:text-[#FAA21B] hover:file:bg-[#FAA21B]/20 transition-all"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="admin-label" htmlFor="host-interests">Interests</label>
                <input
                  id="host-interests"
                  type="text"
                  value={form.interests}
                  onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. EDM, Rave Culture, DJing"
                />
              </div>

              {/* Description */}
              <div>
                <label className="admin-label" htmlFor="host-description">Description</label>
                <textarea
                  id="host-description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="A short bio about this host…"
                />
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="admin-label">Social Links</label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-xs flex items-center gap-1 text-[#FAA21B] hover:text-[#FAA21B]/80 font-medium"
                  >
                    <Plus className="size-3" aria-hidden="true" /> Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {form.social_links.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                        aria-label={`Social platform ${i + 1}`}
                        className="admin-input w-36 px-3 py-2 text-sm"
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
                        placeholder="https://…"
                        aria-label={`Social URL ${i + 1}`}
                        className="admin-input flex-1 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(i)}
                        aria-label={`Remove social link ${i + 1}`}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {form.social_links.length === 0 && (
                    <p className="text-xs text-white/30 flex items-center gap-1">
                      <Link className="size-3" aria-hidden="true" /> No social links yet — click &quot;Add Link&quot;
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 px-4 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 admin-btn-ghost rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 admin-btn-primary rounded-lg disabled:opacity-50"
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
