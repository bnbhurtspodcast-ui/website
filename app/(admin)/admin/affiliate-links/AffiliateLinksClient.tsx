'use client'

import { Link2, Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import { useState } from 'react'
import type { AffiliateLink } from '@/types'
import {
  createAffiliateLink,
  updateAffiliateLink,
  deleteAffiliateLink,
  toggleAffiliateLinkActive,
} from '@/app/(admin)/admin/actions'

type FormState = {
  name: string
  description: string
  image_url: string
  type: 'link' | 'code'
  value: string
  tracking_url: string
  terms: string
  website_link: string
  expires_at: string // empty string = null in DB
  is_active: boolean
}

const emptyForm: FormState = {
  name: '',
  description: '',
  image_url: '',
  type: 'link',
  value: '',
  tracking_url: '',
  terms: '',
  website_link: '',
  expires_at: '',
  is_active: true,
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return 'Never'
  const d = new Date(expiresAt)
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function AffiliateLinksClient({ links: initialLinks }: { links: AffiliateLink[] }) {
  const [links, setLinks] = useState<AffiliateLink[]>(initialLinks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AffiliateLink | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setImageError(false)
    setModalOpen(true)
  }

  function openEdit(link: AffiliateLink) {
    setEditing(link)
    setForm({
      name: link.name,
      description: link.description,
      image_url: link.image_url,
      type: link.type,
      value: link.value,
      tracking_url: link.tracking_url ?? '',
      terms: link.terms ?? '',
      website_link: link.website_link ?? '',
      expires_at: link.expires_at ? link.expires_at.slice(0, 16) : '',
      is_active: link.is_active,
    })
    setError(null)
    setImageError(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setImageError(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    if (!form.image_url.trim()) { setError('Image URL is required'); return }
    if (!form.value.trim()) { setError(form.type === 'link' ? 'URL is required' : 'Discount code is required'); return }

    setLoading(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      type: form.type,
      value: form.value.trim(),
      tracking_url: form.tracking_url.trim() || null,
      terms: form.terms.trim() || null,
      website_link: form.website_link.trim() || null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      is_active: form.is_active,
    }

    const result = editing
      ? await updateAffiliateLink(editing.id, payload)
      : await createAffiliateLink(payload)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.link) {
      if (editing) {
        setLinks((prev) => prev.map((l) => l.id === editing.id ? result.link! : l))
      } else {
        setLinks((prev) => [result.link!, ...prev])
      }
    }

    setLoading(false)
    closeModal()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const result = await deleteAffiliateLink(id)
    if (result.error) alert(result.error)
    else setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  async function handleToggle(id: string, current: boolean) {
    // Optimistic update
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, is_active: !current } : l))
    const result = await toggleAffiliateLinkActive(id, !current)
    if (result.error) {
      // Revert on error
      setLinks((prev) => prev.map((l) => l.id === id ? { ...l, is_active: current } : l))
      alert(result.error)
    }
  }

  const activeCount = links.filter((l) => l.is_active && !isExpired(l.expires_at)).length

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Affiliated Links</h1>
          <p className="text-sm text-white/45">Manage links and discount codes shown on the homepage</p>
        </div>
        <button
          onClick={openAdd}
          className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Link
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs">
        <div className="admin-card p-4">
          <div className="text-2xl font-black text-white">{links.length}</div>
          <div className="text-sm text-white/40">Total</div>
        </div>
        <div className="admin-card p-4">
          <div className="text-2xl font-black text-[#FAA21B]">{activeCount}</div>
          <div className="text-sm text-white/40">Active</div>
        </div>
      </div>

      {/* Table / Empty state */}
      {links.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-20" role="status">
          <Link2 className="size-12 mb-4 text-white/15" aria-hidden="true" />
          <p className="font-medium text-white/40">No affiliated links yet</p>
          <p className="text-sm mt-1 text-white/25">Click &quot;Add Link&quot; to create the first one</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-14">Img</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-20">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider max-w-[180px]">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-28">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-20">Active</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {links.map((link) => {
                  const expired = isExpired(link.expires_at)
                  return (
                    <tr key={link.id} className="hover:bg-white/3 transition-colors">
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="size-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={link.image_url}
                            alt=""
                            className="size-10 object-cover"
                            onError={(e) => {
                              const el = e.currentTarget
                              el.style.display = 'none'
                              const next = el.nextElementSibling as HTMLElement | null
                              if (next) next.style.display = ''
                            }}
                          />
                          <Tag className="size-4 text-white/20" style={{ display: 'none' }} />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{link.name}</div>
                        <div className="text-xs text-white/35 line-clamp-1 mt-0.5">{link.description}</div>
                      </td>

                      {/* Type badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          link.type === 'link'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                            : 'bg-[#FAA21B]/15 text-[#FAA21B] border border-[#FAA21B]/25'
                        }`}>
                          {link.type === 'link' ? 'Link' : 'Code'}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3 max-w-[180px]">
                        <span className="text-white/60 truncate block text-xs font-mono">
                          {link.value.length > 40 ? link.value.slice(0, 40) + '…' : link.value}
                        </span>
                      </td>

                      {/* Expires */}
                      <td className="px-4 py-3">
                        {expired ? (
                          <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                            Expired
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">{formatExpiry(link.expires_at)}</span>
                        )}
                      </td>

                      {/* Active toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(link.id, link.is_active)}
                          aria-label={link.is_active ? 'Deactivate' : 'Activate'}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                            link.is_active ? 'bg-[#FAA21B]' : 'bg-white/15'
                          }`}
                        >
                          <span
                            className={`inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              link.is_active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(link)}
                            aria-label={`Edit ${link.name}`}
                            className="p-1.5 text-[#FAA21B]/60 hover:text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id, link.name)}
                            aria-label={`Delete ${link.name}`}
                            className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
            aria-labelledby="affiliate-modal-title"
            className="admin-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="affiliate-modal-title" className="text-2xl font-bold text-white">
                {editing ? 'Edit Affiliated Link' : 'Add Affiliated Link'}
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
                <label className="admin-label" htmlFor="afl-name">
                  Name <span className="text-[#FAA21B]">*</span>
                </label>
                <input
                  id="afl-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. SKULLCANDY Headphones"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="admin-label" htmlFor="afl-description">
                  Description <span className="text-[#FAA21B]">*</span>
                </label>
                <textarea
                  id="afl-description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="A short description shown on the homepage card…"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="admin-label" htmlFor="afl-image">
                  Image URL <span className="text-[#FAA21B]">*</span>
                </label>
                <input
                  id="afl-image"
                  type="url"
                  value={form.image_url}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, image_url: e.target.value }))
                    setImageError(false)
                  }}
                  className="admin-input"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {form.image_url && (
                  <div className="mt-2">
                    {!imageError ? (
                      <img
                        src={form.image_url}
                        alt="Preview"
                        onError={() => setImageError(true)}
                        className="h-24 w-auto rounded-lg object-cover border border-white/10"
                      />
                    ) : (
                      <p className="text-xs text-red-400">Could not load image from this URL</p>
                    )}
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="admin-label" htmlFor="afl-type">
                  Type <span className="text-[#FAA21B]">*</span>
                </label>
                <select
                  id="afl-type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'link' | 'code' }))}
                  className="admin-input"
                >
                  <option value="link" className="bg-[#08111e]">Link — opens a URL</option>
                  <option value="code" className="bg-[#08111e]">Code — discount/promo code to copy</option>
                </select>
              </div>

              {/* Value (URL or code) */}
              <div>
                <label className="admin-label" htmlFor="afl-value">
                  {form.type === 'link' ? 'URL' : 'Discount Code'} <span className="text-[#FAA21B]">*</span>
                </label>
                <input
                  id="afl-value"
                  type={form.type === 'link' ? 'url' : 'text'}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  className="admin-input"
                  placeholder={form.type === 'link' ? 'https://…' : 'e.g. BNBHURTS20'}
                  required
                />
              </div>

              {/* Website Link */}
              <div>
                <label className="admin-label" htmlFor="afl-website">
                  Website Link <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <input
                  id="afl-website"
                  type="url"
                  value={form.website_link}
                  onChange={(e) => setForm((f) => ({ ...f, website_link: e.target.value }))}
                  className="admin-input"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-white/30 mt-1">Brand or product homepage — shown as a secondary link on the card</p>
              </div>

              {/* Tracking URL */}
              <div>
                <label className="admin-label" htmlFor="afl-tracking">
                  Tracking URL <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <input
                  id="afl-tracking"
                  type="url"
                  value={form.tracking_url}
                  onChange={(e) => setForm((f) => ({ ...f, tracking_url: e.target.value }))}
                  className="admin-input"
                  placeholder="https://track.example.com/…"
                />
                <p className="text-xs text-white/30 mt-1">Internal tracking link — not shown publicly</p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="admin-label" htmlFor="afl-terms">
                  Terms & Conditions <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <textarea
                  id="afl-terms"
                  value={form.terms}
                  onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="e.g. Valid for new customers only. Cannot be combined with other offers."
                />
              </div>

              {/* Expiration date */}
              <div>
                <label className="admin-label" htmlFor="afl-expires">
                  Expiration Date <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <input
                  id="afl-expires"
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                  className="admin-input"
                />
                <p className="text-xs text-white/30 mt-1">Leave blank for no expiration</p>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    form.is_active ? 'bg-[#FAA21B]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      form.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <label className="text-sm text-white/70 cursor-pointer select-none" onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}>
                  Active <span className="text-white/35">(visible on homepage)</span>
                </label>
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
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

