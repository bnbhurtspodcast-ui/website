'use client'

import { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { Youtube, Instagram, Trash2, History, Video, Image, LayoutGrid } from 'lucide-react'
import { deleteSocialPost } from '@/app/(admin)/admin/actions'
import type { SocialPost, SocialPlatform } from '@/types'

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  youtube: <Youtube className="size-3.5" />,
  instagram: <Instagram className="size-3.5" />,
  tiktok: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
    </svg>
  ),
}

const TYPE_ICONS = {
  video: <Video className="size-4" />,
  photo: <Image className="size-4" />,
  multi: <LayoutGrid className="size-4" />,
}

const STATUS_STYLES = {
  posted: 'bg-green-500/15 text-green-300 border-green-500/30',
  failed: 'bg-red-500/15 text-red-300 border-red-500/30',
  draft: 'bg-white/10 text-white/50 border-white/15',
  scheduled: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
}

export function PostHistory({ posts }: { posts: SocialPost[] }) {
  const [localPosts, setLocalPosts] = useState(posts)
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Remove this post from history? This cannot be undone.')) return
    setLoadingId(id)
    startTransition(async () => {
      const result = await deleteSocialPost(id)
      if (!result.error) {
        setLocalPosts((prev) => prev.filter((p) => p.id !== id))
      }
      setLoadingId(null)
    })
  }

  if (localPosts.length === 0) {
    return (
      <div className="text-center py-16 text-white/30">
        <History className="size-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No post history yet</p>
        <p className="text-sm mt-1">Posts marked as &ldquo;Posted&rdquo; will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {localPosts.map((post) => {
        const isLoading = loadingId === post.id && isPending
        return (
          <div
            key={post.id}
            className="admin-card p-4 flex flex-col sm:flex-row sm:items-start gap-4 opacity-80"
          >
            {/* Type icon */}
            <div className="flex-shrink-0 size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
              {TYPE_ICONS[post.post_type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[post.status]}`}>
                  {post.status}
                </span>
                {post.platforms.map((p) => (
                  <span key={p} className="flex items-center gap-1 text-[11px] text-white/40 capitalize">
                    {PLATFORM_ICONS[p]}
                    {p}
                  </span>
                ))}
              </div>

              {post.title && (
                <p className="text-sm font-semibold text-white/70 truncate">{post.title}</p>
              )}
              <p className="text-sm text-white/50 line-clamp-2">{post.description}</p>

              <p className="text-xs text-white/30">
                Scheduled for {format(parseISO(post.scheduled_at), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(post.id)}
              disabled={isLoading}
              title="Remove from history"
              className="p-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
