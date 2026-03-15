'use client'

import { Youtube, Instagram, Construction } from 'lucide-react'
import type { SocialPost } from '@/types'

const TikTokIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
  </svg>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SocialMediaClient({ posts }: { posts: SocialPost[] }) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Social Media</h1>
        <p className="text-sm text-white/45">Schedule and track posts across YouTube, Instagram, and TikTok</p>
      </div>

      {/* Under construction banner */}
      <div className="admin-card p-10 flex flex-col items-center text-center gap-6">
        <div className="size-16 rounded-2xl bg-[#FAA21B]/10 border border-[#FAA21B]/25 flex items-center justify-center">
          <Construction className="size-8 text-[#FAA21B]" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-white">Under Construction</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Social media auto-publishing is being set up. Waiting on API access approval from Meta and TikTok before this feature goes live.
          </p>
        </div>

        {/* Platform status */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/8 border border-green-500/20">
            <Youtube className="size-5 text-green-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-green-300">YouTube</p>
              <p className="text-[11px] text-green-400/60">Ready</p>
            </div>
            <span className="ml-auto size-2 rounded-full bg-green-400 flex-shrink-0" />
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8">
            <Instagram className="size-5 text-white/30 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white/40">Instagram</p>
              <p className="text-[11px] text-white/25">Pending approval</p>
            </div>
            <span className="ml-auto size-2 rounded-full bg-yellow-400/60 flex-shrink-0" />
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8">
            <TikTokIcon />
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-white/40">TikTok</p>
              <p className="text-[11px] text-white/25">Pending approval</p>
            </div>
            <span className="ml-auto size-2 rounded-full bg-yellow-400/60 flex-shrink-0" />
          </div>
        </div>

        <p className="text-xs text-white/25">
          This page will unlock once all platform integrations are connected.
        </p>
      </div>
    </div>
  )
}
