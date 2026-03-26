'use client'

import { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { Youtube, Instagram, CheckCircle, Trash2, Video, Image, LayoutGrid, Clock } from 'lucide-react'
import { markPostAsPosted, deleteSocialPost } from '@/app/(admin)/admin/social-media/actions'
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
  draft: 'bg-white/10 text-white/50 border-white/15',
  scheduled: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  posted: 'bg-green-500/15 text-green-300 border-green-500/30',
  failed: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export function PostList({ posts }: { posts: SocialPost[] }) {
  const [localPosts, setLocalPosts] = useState(posts)
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleMarkPosted(id: string) {
    setLoadingId(id)
    startTransition(async () => {
      const result = await markPostAsPosted(id)
      if (!result.error) {
        setLocalPosts((prev) => prev.filter((p) => p.id !== id))
      }
      setLoadingId(null)
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
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
        <Clock className="size-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No scheduled posts</p>
        <p className="text-sm mt-1">Create a new post using the button above.</p>
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
            className="admin-card p-4 flex flex-col sm:flex-row sm:items-start gap-4"
          >
            {/* Type icon */}
            <div className="flex-shrink-0 size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
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
                <p className="text-sm font-semibold text-white truncate">{post.title}</p>
              )}
              <p className="text-sm text-white/60 line-clamp-2">{post.description}</p>

              <p className="text-xs text-white/35 flex items-center gap-1.5">
                <Clock className="size-3" />
                {format(parseISO(post.scheduled_at), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleMarkPosted(post.id)}
                disabled={isLoading}
                title="Mark as posted"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/25 hover:bg-green-500/20 transition-colors disabled:opacity-40"
              >
                <CheckCircle className="size-3.5" />
                Mark Posted
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                disabled={isLoading}
                title="Delete post"
                className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
