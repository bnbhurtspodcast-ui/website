'use client'

import { useState } from 'react'
import { X, Video, Image, LayoutGrid, Youtube, Instagram, Upload, Loader2, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createSocialPost } from '@/app/(admin)/admin/social-media/actions'
import type { SocialPostType, SocialPlatform, PlatformSettings } from '@/types'

type WizardFormState = {
  title: string
  description: string
  scheduled_at: string
  platforms: SocialPlatform[]
  platform_settings: PlatformSettings
}

const DEFAULT_FORM: WizardFormState = {
  title: '',
  description: '',
  scheduled_at: '',
  platforms: ['youtube', 'instagram', 'tiktok'],
  platform_settings: {
    youtube: { visibility: 'public' },
    instagram: { hashtags: '', location_tag: '' },
    tiktok: { privacy: 'public', allow_duet: true, allow_stitch: true },
  },
}

const STEPS = ['Type', 'Upload', 'Settings', 'Review']

const TikTokIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
  </svg>
)

async function uploadFiles(files: File[]): Promise<string[]> {
  const supabase = createClient()
  const paths: string[] = []
  for (const file of files) {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('social-media-uploads')
      .upload(path, file)
    if (error) throw new Error(error.message)
    paths.push(path)
  }
  return paths
}

export function PostWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [postType, setPostType] = useState<SocialPostType | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [mediaPaths, setMediaPaths] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [form, setForm] = useState<WizardFormState>(DEFAULT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function togglePlatform(p: SocialPlatform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }))
  }

  async function handleUploadAndNext() {
    if (selectedFiles.length === 0) {
      setStep(3)
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const paths = await uploadFiles(selectedFiles)
      setMediaPaths(paths)
      setStep(3)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    const scheduledAtUtc = new Date(form.scheduled_at).toISOString()
    const result = await createSocialPost({
      title: form.title.trim() || null,
      description: form.description.trim(),
      post_type: postType!,
      scheduled_at: scheduledAtUtc,
      status: 'scheduled',
      platforms: form.platforms,
      media_paths: mediaPaths.length > 0 ? mediaPaths : null,
      platform_settings: form.platform_settings,
    })
    if (result.error) {
      setSubmitError(result.error)
      setSubmitting(false)
      return
    }
    onClose()
  }

  const canProceedStep3 =
    form.description.trim().length > 0 &&
    form.scheduled_at.length > 0 &&
    form.platforms.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0a1220] border border-[#FAA21B]/20 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-bold text-white">New Social Post</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-4">
          {STEPS.map((label, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3 | 4
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      'size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      done
                        ? 'bg-[#FAA21B] text-[#080f1a]'
                        : active
                        ? 'bg-[#FAA21B]/20 text-[#FAA21B] border border-[#FAA21B]/50'
                        : 'bg-white/5 text-white/25 border border-white/10',
                    ].join(' ')}
                  >
                    {done ? <Check className="size-3.5" /> : stepNum}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-white/70' : 'text-white/25'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 ${done ? 'bg-[#FAA21B]/40' : 'bg-white/8'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── Step 1: Post Type ── */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-white/50">What type of content are you posting?</p>
              {([
                { type: 'video' as SocialPostType, icon: <Video className="size-6" />, label: 'Video', desc: 'A single video file' },
                { type: 'photo' as SocialPostType, icon: <Image className="size-6" />, label: 'Photo', desc: 'A single image' },
                { type: 'multi' as SocialPostType, icon: <LayoutGrid className="size-6" />, label: 'Multi-post', desc: 'Carousel of multiple images' },
              ]).map(({ type, icon, label, desc }) => (
                <button
                  key={type}
                  onClick={() => { setPostType(type); setStep(2) }}
                  className={[
                    'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors',
                    postType === type
                      ? 'bg-[#FAA21B]/10 border-[#FAA21B]/40 text-[#FAA21B]'
                      : 'bg-white/3 border-white/10 text-white/60 hover:bg-white/6 hover:border-white/20',
                  ].join(' ')}
                >
                  <div className="flex-shrink-0">{icon}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Step 2: Upload ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-white/50">
                Upload your {postType === 'video' ? 'video' : 'image(s)'}. You can skip this if you&apos;re not ready yet.
              </p>
              <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/15 hover:border-[#FAA21B]/30 cursor-pointer transition-colors bg-white/2">
                <Upload className="size-8 text-white/25" />
                <span className="text-sm text-white/40">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : 'Click to select files'}
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept={postType === 'video' ? 'video/*' : 'image/*'}
                  multiple={postType === 'multi'}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    setSelectedFiles(files)
                    setUploadError(null)
                  }}
                />
              </label>
              {selectedFiles.length > 0 && (
                <ul className="space-y-1">
                  {selectedFiles.map((f, i) => (
                    <li key={i} className="text-xs text-white/50 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#FAA21B]/60 flex-shrink-0" />
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
              {uploadError && (
                <p className="text-xs text-red-400">{uploadError}</p>
              )}
            </div>
          )}

          {/* ── Step 3: Settings ── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Caption / Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your caption..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50 resize-none"
                />
              </div>

              {/* YouTube title */}
              {form.platforms.includes('youtube') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    YouTube Title
                  </label>
                  <input
                    type="text"
                    placeholder="Video title for YouTube"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50"
                  />
                </div>
              )}

              {/* Schedule */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Schedule Date & Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                  className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50 [color-scheme:dark]"
                />
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Platforms <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { id: 'youtube' as SocialPlatform, icon: <Youtube className="size-4" />, label: 'YouTube' },
                    { id: 'instagram' as SocialPlatform, icon: <Instagram className="size-4" />, label: 'Instagram' },
                    { id: 'tiktok' as SocialPlatform, icon: <TikTokIcon />, label: 'TikTok' },
                  ]).map(({ id, icon, label }) => {
                    const active = form.platforms.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => togglePlatform(id)}
                        className={[
                          'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                          active
                            ? 'bg-[#FAA21B]/10 border-[#FAA21B]/40 text-[#FAA21B]'
                            : 'bg-white/3 border-white/10 text-white/40 hover:bg-white/6',
                        ].join(' ')}
                      >
                        {icon} {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Platform-specific settings */}
              {form.platforms.includes('youtube') && (
                <div className="space-y-2 p-4 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-xs font-bold text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
                    <Youtube className="size-3.5" /> YouTube Settings
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">Visibility</label>
                    <select
                      value={form.platform_settings.youtube?.visibility ?? 'public'}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          platform_settings: {
                            ...f.platform_settings,
                            youtube: { visibility: e.target.value as 'public' | 'unlisted' | 'private' },
                          },
                        }))
                      }
                      className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50"
                    >
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              )}

              {form.platforms.includes('instagram') && (
                <div className="space-y-2 p-4 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-xs font-bold text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
                    <Instagram className="size-3.5" /> Instagram Settings
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">Hashtags</label>
                    <input
                      type="text"
                      placeholder="#edm #rave #toronto"
                      value={form.platform_settings.instagram?.hashtags ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          platform_settings: {
                            ...f.platform_settings,
                            instagram: {
                              ...(f.platform_settings.instagram ?? { location_tag: '' }),
                              hashtags: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">Location Tag</label>
                    <input
                      type="text"
                      placeholder="Toronto, Ontario"
                      value={form.platform_settings.instagram?.location_tag ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          platform_settings: {
                            ...f.platform_settings,
                            instagram: {
                              ...(f.platform_settings.instagram ?? { hashtags: '' }),
                              location_tag: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50"
                    />
                  </div>
                </div>
              )}

              {form.platforms.includes('tiktok') && (
                <div className="space-y-2 p-4 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-xs font-bold text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
                    <TikTokIcon /> TikTok Settings
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">Privacy</label>
                    <select
                      value={form.platform_settings.tiktok?.privacy ?? 'public'}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          platform_settings: {
                            ...f.platform_settings,
                            tiktok: {
                              ...(f.platform_settings.tiktok ?? { allow_duet: true, allow_stitch: true }),
                              privacy: e.target.value as 'public' | 'friends' | 'private',
                            },
                          },
                        }))
                      }
                      className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FAA21B]/50"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-1">
                    {([
                      { key: 'allow_duet', label: 'Allow Duet' },
                      { key: 'allow_stitch', label: 'Allow Stitch' },
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.platform_settings.tiktok?.[key] ?? true}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              platform_settings: {
                                ...f.platform_settings,
                                tiktok: {
                                  ...(f.platform_settings.tiktok ?? { privacy: 'public', allow_duet: true, allow_stitch: true }),
                                  [key]: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="accent-[#FAA21B]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-white/50">Review your post before saving.</p>

              <div className="space-y-3 text-sm">
                <Row label="Type" value={postType ?? ''} />
                <Row label="Platforms" value={form.platforms.join(', ')} />
                {form.title && <Row label="YouTube Title" value={form.title} />}
                <div className="space-y-1">
                  <span className="text-xs text-white/35 uppercase tracking-wider font-semibold">Caption</span>
                  <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{form.description}</p>
                </div>
                <Row label="Scheduled" value={form.scheduled_at ? new Date(form.scheduled_at).toLocaleString() : '—'} />
                <Row label="Media files" value={selectedFiles.length > 0 ? `${selectedFiles.length} file(s) uploaded` : 'None'} />

                {form.platforms.includes('youtube') && (
                  <Row label="YouTube visibility" value={form.platform_settings.youtube?.visibility ?? 'public'} />
                )}
                {form.platforms.includes('instagram') && form.platform_settings.instagram?.hashtags && (
                  <Row label="Instagram hashtags" value={form.platform_settings.instagram.hashtags} />
                )}
                {form.platforms.includes('tiktok') && (
                  <Row label="TikTok privacy" value={form.platform_settings.tiktok?.privacy ?? 'public'} />
                )}
              </div>

              {submitError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                disabled={uploading || submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/6 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="size-4" /> Back
              </button>
            )}
          </div>

          <div>
            {step === 2 && (
              <button
                onClick={handleUploadAndNext}
                disabled={uploading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-[#FAA21B]/10 text-[#FAA21B] border border-[#FAA21B]/30 hover:bg-[#FAA21B]/20 transition-colors disabled:opacity-40"
              >
                {uploading ? (
                  <><Loader2 className="size-4 animate-spin" /> Uploading…</>
                ) : (
                  <>{selectedFiles.length > 0 ? 'Upload & Continue' : 'Skip'} <ChevronRight className="size-4" /></>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-[#FAA21B]/10 text-[#FAA21B] border border-[#FAA21B]/30 hover:bg-[#FAA21B]/20 transition-colors disabled:opacity-40"
              >
                Review <ChevronRight className="size-4" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-[#FAA21B] text-[#080f1a] hover:bg-[#FAA21B]/90 transition-colors disabled:opacity-40"
              >
                {submitting ? (
                  <><Loader2 className="size-4 animate-spin" /> Saving…</>
                ) : (
                  <><Check className="size-4" /> Confirm & Save</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/35 min-w-[120px] text-xs uppercase tracking-wider font-semibold pt-0.5">{label}</span>
      <span className="text-white/80 capitalize">{value}</span>
    </div>
  )
}
