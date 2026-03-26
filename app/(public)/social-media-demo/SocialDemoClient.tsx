'use client'

import { useTransition } from 'react'
import { Youtube, Instagram, Loader2, CheckCircle2, XCircle, LinkIcon } from 'lucide-react'
import Image from 'next/image'
import type { SocialToken, OAuthPlatform } from '@/types'
import { getYouTubeOAuthUrl, getTikTokOAuthUrl, getMetaOAuthUrl, getThreadsOAuthUrl } from '@/app/(admin)/admin/social-media/actions'

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

type DemoPlatform = {
  id: OAuthPlatform
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  product: string
  scopes: string[]
  getUrl: () => Promise<{ url: string }>
}

const PLATFORMS: DemoPlatform[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    icon: <Youtube className="size-5" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/8',
    borderColor: 'border-red-500/20',
    product: 'YouTube Data API v3',
    scopes: ['youtube.upload', 'youtube.readonly'],
    getUrl: () => getYouTubeOAuthUrl('demo'),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: <TikTokIcon />,
    color: 'text-white/80',
    bgColor: 'bg-white/4',
    borderColor: 'border-white/12',
    product: 'Login Kit · Content Posting API · Display API',
    scopes: ['user.info.basic', 'video.list', 'video.upload'],
    getUrl: () => getTikTokOAuthUrl('demo'),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram className="size-5" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/8',
    borderColor: 'border-pink-500/20',
    product: 'Instagram Graph API · Facebook Login',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    getUrl: () => getMetaOAuthUrl('demo'),
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: <ThreadsIcon />,
    color: 'text-white/80',
    bgColor: 'bg-white/4',
    borderColor: 'border-white/12',
    product: 'Threads API',
    scopes: ['threads_basic', 'threads_content_publish'],
    getUrl: () => getThreadsOAuthUrl('demo'),
  },
]

// ── Platform card ──────────────────────────────────────────────────────────────

function DemoPlatformCard({
  platform,
  token,
}: {
  platform: DemoPlatform
  token: SocialToken | undefined
}) {
  const [isPending, startTransition] = useTransition()
  const isConnected = !!token

  function handleConnect() {
    startTransition(async () => {
      const { url } = await platform.getUrl()
      window.location.href = url
    })
  }

  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-4 border ${platform.bgColor} ${platform.borderColor}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className={platform.color}>{platform.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{platform.label}</p>
          <p className="text-[11px] text-white/35 truncate">{platform.product}</p>
        </div>
        <span
          className={`size-2.5 rounded-full flex-shrink-0 ${
            isConnected ? 'bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.4)]' : 'bg-white/20'
          }`}
        />
      </div>

      {/* Scopes */}
      <div className="flex flex-wrap gap-1.5">
        {platform.scopes.map((scope) => (
          <span
            key={scope}
            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/6 border border-white/10 text-white/50"
          >
            {scope}
          </span>
        ))}
      </div>

      {/* Status / action */}
      {isConnected && token ? (
        <div className="flex items-center gap-3 pt-1">
          {token.platform_avatar_url ? (
            <Image
              src={token.platform_avatar_url}
              alt={token.platform_username ?? platform.label}
              width={28}
              height={28}
              className="size-7 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="size-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className={`scale-75 ${platform.color}`}>{platform.icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {token.platform_username ?? 'Connected'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="size-3 text-green-400 flex-shrink-0" />
              <span className="text-[11px] text-green-400">Authorized</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAA21B] hover:bg-[#FAA21B]/90 text-black transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LinkIcon className="size-3.5" />
          )}
          {isPending ? 'Redirecting…' : `Connect ${platform.label}`}
        </button>
      )}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export function SocialDemoClient({
  tokens,
  connected,
  oauthError,
}: {
  tokens: SocialToken[]
  connected?: string
  oauthError?: string
}) {
  const tokenMap = new Map(tokens.map((t) => [t.platform, t]))

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAA21B]/15 border border-[#FAA21B]/30 text-[#FAA21B] uppercase tracking-widest">
            API Integration Demo
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Social Media<br />
            <span className="text-[#FAA21B]">Publishing Integration</span>
          </h1>
          <p className="text-base text-white/50 leading-relaxed">
            This page demonstrates how the Back&nbsp;n&apos;&nbsp;Body Hurts Podcast admin dashboard
            connects to social media platforms using OAuth 2.0 to schedule and publish content.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-14">

        {/* OAuth result banner */}
        {connected && (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-green-500/10 border border-green-500/25 text-sm text-green-300">
            <CheckCircle2 className="size-5 flex-shrink-0" />
            <span>
              {connected === 'meta'
                ? 'Instagram connected successfully — token stored and verified.'
                : `${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully — token stored and verified.`}
            </span>
          </div>
        )}
        {oauthError && (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
            <XCircle className="size-5 flex-shrink-0" />
            OAuth error: {oauthError.replace(/_/g, ' ')}
          </div>
        )}

        {/* Connect Accounts */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Step 1 — Authorize Platforms</h2>
            <p className="text-sm text-white/45">
              Click any platform to begin the real OAuth flow. You will be redirected to the
              platform&apos;s consent screen showing the requested scopes, then returned here after authorization.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORMS.map((platform) => (
              <DemoPlatformCard
                key={platform.id}
                platform={platform}
                token={tokenMap.get(platform.id)}
              />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Step 2 — How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Admin Connects Account',
                desc: 'The podcast admin authenticates via OAuth (Login Kit / Facebook Login). Tokens are securely stored server-side — never exposed to the browser.',
              },
              {
                step: '02',
                title: 'Content is Scheduled',
                desc: 'Posts are created in the admin dashboard with platform-specific settings (visibility, hashtags, privacy) and a scheduled publish time.',
              },
              {
                step: '03',
                title: 'Content is Published',
                desc: 'At publish time, the system uses the stored access token to call the platform API (Content Posting API / Instagram Graph API) and upload the content.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl p-5 bg-white/3 border border-white/8 space-y-3"
              >
                <span className="text-3xl font-black text-[#FAA21B]/40">{step}</span>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scopes table */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Permissions & Scopes</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Platform</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Scopes Requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                <tr>
                  <td className="px-5 py-4 text-white font-medium">TikTok</td>
                  <td className="px-5 py-4 text-white/50 text-xs">Login Kit · Content Posting API · Display API</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {['user.info.basic', 'video.list', 'video.upload'].map((s) => (
                        <code key={s} className="text-[11px] px-2 py-0.5 rounded bg-white/8 text-white/60">{s}</code>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 text-white font-medium">Instagram</td>
                  <td className="px-5 py-4 text-white/50 text-xs">Instagram Graph API · Facebook Login</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'].map((s) => (
                        <code key={s} className="text-[11px] px-2 py-0.5 rounded bg-white/8 text-white/60">{s}</code>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 text-white font-medium">Threads</td>
                  <td className="px-5 py-4 text-white/50 text-xs">Threads API · Facebook Login</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {['threads_basic', 'threads_content_publish'].map((s) => (
                        <code key={s} className="text-[11px] px-2 py-0.5 rounded bg-white/8 text-white/60">{s}</code>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 text-white font-medium">YouTube</td>
                  <td className="px-5 py-4 text-white/50 text-xs">YouTube Data API v3</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {['youtube.upload', 'youtube.readonly'].map((s) => (
                        <code key={s} className="text-[11px] px-2 py-0.5 rounded bg-white/8 text-white/60">{s}</code>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Data usage note */}
        <section className="rounded-2xl p-6 bg-white/3 border border-white/8 space-y-2">
          <h3 className="text-sm font-bold text-white">Data Usage</h3>
          <p className="text-xs text-white/45 leading-relaxed max-w-2xl">
            This application only uses the permissions listed above. Access tokens are stored
            server-side in an encrypted database and are never transmitted to the client browser.
            Tokens are used exclusively to publish content that the podcast admin has explicitly
            scheduled. No user data is collected, sold, or shared with third parties.
          </p>
        </section>
      </div>
    </div>
  )
}
