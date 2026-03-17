'use client'

import { useEffect, useState, useTransition } from 'react'
import { Youtube, Instagram, Loader2, CheckCircle2, XCircle, LinkIcon, Unlink, Plus } from 'lucide-react'
import Image from 'next/image'
import type { SocialPost, SocialToken, OAuthPlatform } from '@/types'
import {
  getYouTubeOAuthUrl,
  getTikTokOAuthUrl,
  getMetaOAuthUrl,
  disconnectSocialPlatform,
} from '@/app/(admin)/admin/actions'
import { PostWizard } from '@/app/(admin)/admin/social-media/PostWizard'
import { PostList } from '@/app/(admin)/admin/social-media/PostList'
import { PostHistory } from '@/app/(admin)/admin/social-media/PostHistory'

// ── Icons ──────────────────────────────────────────────────────────────────────

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? 'size-5'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
  </svg>
)

const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? 'size-5'} viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
    <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.23c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.35-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.6 32.788 27.99 19.874 44.445 13.224 67.17 13.001 95.932L13 96v.067c.224 28.762 6.874 51.487 19.788 67.942 14.504 18.39 36.094 27.796 64.199 27.991h.113c24.906-.173 42.544-6.708 57.256-21.408 19.013-19.001 18.443-42.839 12.133-57.49-4.534-10.564-13.408-19.161-25.952-24.114z" />
  </svg>
)

// ── Platform config ────────────────────────────────────────────────────────────

type PlatformConfig = {
  id: OAuthPlatform
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  getUrl: () => Promise<{ url: string }>
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    icon: <Youtube className="size-5" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/8',
    borderColor: 'border-red-500/20',
    getUrl: getYouTubeOAuthUrl,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: <TikTokIcon />,
    color: 'text-white/70',
    bgColor: 'bg-white/4',
    borderColor: 'border-white/10',
    getUrl: getTikTokOAuthUrl,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram className="size-5" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/8',
    borderColor: 'border-pink-500/20',
    getUrl: getMetaOAuthUrl,
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: <ThreadsIcon />,
    color: 'text-white/70',
    bgColor: 'bg-white/4',
    borderColor: 'border-white/10',
    getUrl: getMetaOAuthUrl,
  },
]

// ── Platform card ──────────────────────────────────────────────────────────────

function PlatformCard({
  config,
  token,
}: {
  config: PlatformConfig
  token: SocialToken | undefined
}) {
  const [isPending, startTransition] = useTransition()
  const isConnected = !!token

  function handleConnect() {
    startTransition(async () => {
      const { url } = await config.getUrl()
      window.location.href = url
    })
  }

  function handleDisconnect() {
    startTransition(async () => {
      await disconnectSocialPlatform(config.id)
    })
  }

  return (
    <div className={`admin-card p-4 flex flex-col gap-4 ${config.bgColor} ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className={config.color}>{config.icon}</span>
        <span className="text-sm font-semibold text-white">{config.label}</span>
        <span
          className={`ml-auto size-2 rounded-full flex-shrink-0 ${
            isConnected ? 'bg-green-400' : 'bg-yellow-400/70'
          }`}
        />
      </div>

      {/* Connected state */}
      {isConnected && token ? (
        <div className="flex items-center gap-3">
          {token.platform_avatar_url ? (
            <Image
              src={token.platform_avatar_url}
              alt={token.platform_username ?? config.label}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className={`scale-75 ${config.color}`}>{config.icon}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">
              {token.platform_username ?? 'Connected'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="size-3 text-green-400 flex-shrink-0" />
              <span className="text-[11px] text-green-400">Connected</span>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={isPending}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/40 hover:text-white/70 hover:bg-white/8 border border-white/10 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Unlink className="size-3" />
            )}
            Disconnect
          </button>
        </div>
      ) : (
        /* Disconnected state */
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <XCircle className="size-3 text-white/25 flex-shrink-0" />
              <span className="text-[11px] text-white/35">Not connected</span>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAA21B] hover:bg-[#FAA21B]/90 text-black transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <LinkIcon className="size-3" />
            )}
            Connect
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SocialMediaClient({
  posts,
  tokens,
  connected,
  oauthError,
}: {
  posts: SocialPost[]
  tokens: SocialToken[]
  connected?: string
  oauthError?: string
}) {
  const [wizardOpen, setWizardOpen] = useState(false)
  const tokenMap = new Map(tokens.map((t) => [t.platform, t]))

  const scheduledPosts = posts.filter((p) => p.status === 'scheduled' || p.status === 'draft')
  const historyPosts = posts.filter((p) => p.status === 'posted' || p.status === 'failed')

  useEffect(() => { /* no-op: connected banner is shown via JSX */ }, [connected])

  return (
    <div className="space-y-6">
      {wizardOpen && <PostWizard onClose={() => setWizardOpen(false)} />}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Social Media</h1>
          <p className="text-sm text-white/45">Schedule and track posts across platforms</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#FAA21B] hover:bg-[#FAA21B]/90 text-black transition-colors"
        >
          <Plus className="size-4" />
          New Post
        </button>
      </div>

      {/* OAuth success/error banner */}
      {connected && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/25 text-sm text-green-300">
          <CheckCircle2 className="size-4 flex-shrink-0" />
          {connected === 'meta'
            ? 'Instagram & Threads connected successfully.'
            : `${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully.`}
        </div>
      )}
      {oauthError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
          <XCircle className="size-4 flex-shrink-0" />
          OAuth error: {oauthError.replace(/_/g, ' ')}
        </div>
      )}

      {/* Connect Accounts */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          Connected Accounts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform.id}
              config={platform}
              token={tokenMap.get(platform.id)}
            />
          ))}
        </div>
      </section>

      {/* Scheduled posts */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          Scheduled
        </h2>
        <PostList posts={scheduledPosts} />
      </section>

      {/* Post history */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          History
        </h2>
        <PostHistory posts={historyPosts} />
      </section>
    </div>
  )
}
