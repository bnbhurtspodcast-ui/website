'use client'

import type { SocialPost } from '@/types'

export function SocialPostChip({ post }: { post: SocialPost }) {
  const label = post.title ?? post.description.slice(0, 28)
  const platformLabel = post.platforms.join(', ')

  return (
    <div
      title={`${label} · ${platformLabel}`}
      className={[
        'w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold',
        'border truncate leading-tight',
        'bg-red-500/20 border-red-500/40 text-red-200',
      ].join(' ')}
    >
      {label}
    </div>
  )
}
