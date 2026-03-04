'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { FileText, Clock, Calendar, Youtube, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Episode } from '@/types'
import { saveHighlightedEpisode } from '@/app/(admin)/admin/actions'

interface ContentClientProps {
  episodes: Episode[]
  currentUrl: string | null
}

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname === 'youtu.be') return url.pathname.slice(1)
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v')
      if (v) return v
      const pathParts = url.pathname.split('/')
      const embedIdx = pathParts.indexOf('embed')
      if (embedIdx !== -1) return pathParts[embedIdx + 1] ?? null
    }
  } catch {
    // not a URL — fall through
  }
  return null
}

export function ContentClient({ episodes, currentUrl }: ContentClientProps) {
  const [urlInput, setUrlInput] = useState(currentUrl ?? '')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const previewId = extractYouTubeId(urlInput)

  function handleSave() {
    setSaveStatus('idle')
    setErrorMsg(null)
    startTransition(async () => {
      const result = await saveHighlightedEpisode(urlInput)
      if (result.error) {
        setSaveStatus('error')
        setErrorMsg(result.error)
      } else {
        setSaveStatus('success')
      }
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Content Management</h1>
        <p className="text-sm text-white/45">Manage your episodes and featured content</p>
      </div>

      <Tabs defaultValue="episodes">
        <TabsList className="mb-6 bg-white/5 border border-white/10 h-auto p-1">
          <TabsTrigger
            value="episodes"
            className="data-[state=active]:bg-[#FAA21B]/15 data-[state=active]:text-[#FAA21B] data-[state=active]:border-[#FAA21B]/20 text-white/60 gap-2 px-4 py-2"
          >
            <FileText className="size-4" aria-hidden="true" />
            Episodes
          </TabsTrigger>
          <TabsTrigger
            value="highlighted"
            className="data-[state=active]:bg-[#FAA21B]/15 data-[state=active]:text-[#FAA21B] data-[state=active]:border-[#FAA21B]/20 text-white/60 gap-2 px-4 py-2"
          >
            <Youtube className="size-4" aria-hidden="true" />
            Highlighted Episode
          </TabsTrigger>
        </TabsList>

        {/* ── Episodes Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="episodes">
          <div className="admin-card p-4 mb-6 flex items-center gap-3">
            <div className="w-1 h-5 bg-[#FAA21B] rounded-full flex-shrink-0" aria-hidden="true" />
            <p className="text-white/65 text-sm">
              <span className="font-bold text-[#FAA21B]">{episodes.length} episodes</span> found.
              Episodes are managed via your Anchor/Spotify RSS feed.
            </p>
          </div>

          <div className="space-y-4">
            {episodes.map((ep) => (
              <div key={ep.id} className="admin-card p-5 flex gap-5 items-start">
                {ep.imageUrl && (
                  <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden ring-1 ring-[#FAA21B]/20">
                    <Image src={ep.imageUrl} alt={ep.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-1">{ep.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-2 mb-3 leading-relaxed">{ep.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/45">
                    {ep.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-white/30" aria-hidden="true" />{ep.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-white/30" aria-hidden="true" />
                      {new Date(ep.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex px-2 py-0.5 bg-[#FAA21B]/10 text-[#FAA21B] rounded text-xs font-medium">
                      {ep.episodeType}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={ep.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen to audio for ${ep.title}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAA21B]/10 text-[#FAA21B] border border-[#FAA21B]/20 rounded-lg hover:bg-[#FAA21B]/20 transition-colors text-sm font-medium"
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    Audio
                  </a>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Highlighted Episode Tab ───────────────────────────────────────── */}
        <TabsContent value="highlighted">
          <div className="max-w-2xl space-y-6">
            <div className="admin-card p-4 flex items-center gap-3">
              <div className="w-1 h-5 bg-[#FAA21B] rounded-full flex-shrink-0" aria-hidden="true" />
              <p className="text-white/65 text-sm">
                Set a YouTube video to feature on the public homepage. Leave blank to hide the section.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="yt-url" className="admin-label">
                YouTube URL or Video ID
              </label>
              <div className="flex gap-3">
                <input
                  id="yt-url"
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value)
                    setSaveStatus('idle')
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="admin-input flex-1"
                  spellCheck={false}
                  aria-describedby={saveStatus === 'error' ? 'yt-error' : undefined}
                />
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  aria-label="Save highlighted episode URL"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAA21B] text-[#112B4F] font-bold rounded-lg hover:bg-[#FAA21B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isPending
                    ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    : <Save className="size-4" aria-hidden="true" />
                  }
                  {isPending ? 'Saving…' : 'Save'}
                </button>
              </div>

              {saveStatus === 'success' && (
                <p role="status" className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> Saved successfully
                </p>
              )}
              {saveStatus === 'error' && (
                <p id="yt-error" role="alert" className="flex items-center gap-1.5 text-sm text-red-400">
                  <AlertCircle className="size-4" aria-hidden="true" /> {errorMsg ?? 'Failed to save'}
                </p>
              )}
            </div>

            {previewId ? (
              <div className="space-y-2">
                <p className="text-xs text-white/45 uppercase tracking-widest font-medium">Preview</p>
                <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-[#FAA21B]/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}`}
                    title="Highlighted episode preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : urlInput.trim() ? (
              <p className="text-sm text-amber-400/80">
                Could not parse a valid YouTube video ID from that input.
              </p>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
