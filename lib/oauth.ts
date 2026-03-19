/**
 * Server-only OAuth utilities for YouTube, TikTok, and Meta (Instagram/Threads).
 * Never import this in client components.
 */

import { createHash, randomBytes } from 'crypto'

// ── Helpers ────────────────────────────────────────────────────────────────────

export function generateState(): string {
  return randomBytes(32).toString('hex')
}

export function generatePKCE(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

// ── YouTube (Google OAuth 2.0) ─────────────────────────────────────────────────

export function buildYouTubeAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    redirect_uri: `${appUrl()}/oauth/youtube`,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeYouTubeCode(code: string): Promise<{
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  username: string | null
  avatar_url: string | null
  user_id: string | null
  raw: unknown
}> {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.YOUTUBE_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
      redirect_uri: `${appUrl()}/oauth/youtube`,
      grant_type: 'authorization_code',
    }),
  })
  const raw = await tokenRes.json()
  if (!tokenRes.ok) throw new Error(`YouTube token exchange failed: ${JSON.stringify(raw)}`)

  const { access_token, refresh_token, expires_in } = raw
  const expires_at = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null

  // Fetch channel profile
  let username: string | null = null
  let avatar_url: string | null = null
  let user_id: string | null = null
  try {
    const profileRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const profile = await profileRes.json()
    const channel = profile?.items?.[0]
    if (channel) {
      user_id = channel.id ?? null
      username = channel.snippet?.title ?? null
      avatar_url = channel.snippet?.thumbnails?.default?.url ?? null
    }
  } catch { /* non-fatal */ }

  return { access_token, refresh_token: refresh_token ?? null, expires_at, username, avatar_url, user_id, raw }
}

// ── TikTok (Login Kit with PKCE) ───────────────────────────────────────────────

export function buildTikTokAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    redirect_uri: `${appUrl()}/oauth/tiktok`,
    response_type: 'code',
    scope: 'user.info.basic,video.list,video.upload',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`
}

export async function exchangeTikTokCode(code: string, codeVerifier: string): Promise<{
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  username: string | null
  avatar_url: string | null
  user_id: string | null
  scopes: string[]
  raw: unknown
}> {
  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${appUrl()}/oauth/tiktok`,
      code_verifier: codeVerifier,
    }),
  })
  const raw = await tokenRes.json()
  if (!tokenRes.ok) throw new Error(`TikTok token exchange failed: ${JSON.stringify(raw)}`)

  const { access_token, refresh_token, expires_in, scope } = raw
  const expires_at = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null
  const scopes: string[] = scope ? scope.split(',') : []

  // Fetch user info
  let username: string | null = null
  let avatar_url: string | null = null
  let user_id: string | null = null
  try {
    const profileRes = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const profile = await profileRes.json()
    const data = profile?.data?.user
    if (data) {
      user_id = data.open_id ?? null
      username = data.display_name ?? null
      avatar_url = data.avatar_url ?? null
    }
  } catch { /* non-fatal */ }

  return { access_token, refresh_token: refresh_token ?? null, expires_at, username, avatar_url, user_id, scopes, raw }
}

// ── Meta / Facebook (Instagram + Threads) ─────────────────────────────────────

export function buildMetaAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${appUrl()}/oauth/meta`,
    response_type: 'code',
    scope: [
      'instagram_basic',
      'instagram_content_publish',
      'pages_read_engagement',
      'threads_basic',
      'threads_content_publish',
    ].join(','),
    state,
  })
  return `https://www.facebook.com/v21.0/dialog/oauth?${params}`
}

export async function exchangeMetaCode(code: string): Promise<{
  access_token: string
  expires_at: string | null
  username: string | null
  avatar_url: string | null
  user_id: string | null
  raw: unknown
}> {
  // Step 1: short-lived token
  const shortParams = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: `${appUrl()}/oauth/meta`,
    code,
  })
  const shortRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${shortParams}`
  )
  const shortRaw = await shortRes.json()
  if (!shortRes.ok) throw new Error(`Meta short-lived token failed: ${JSON.stringify(shortRaw)}`)

  // Step 2: long-lived token (60 days)
  const longParams = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortRaw.access_token,
  })
  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${longParams}`
  )
  const raw = await longRes.json()
  if (!longRes.ok) throw new Error(`Meta long-lived token failed: ${JSON.stringify(raw)}`)

  const { access_token, expires_in } = raw
  const expires_at = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null

  // Fetch profile
  let username: string | null = null
  let avatar_url: string | null = null
  let user_id: string | null = null
  try {
    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,picture&access_token=${access_token}`
    )
    const profile = await profileRes.json()
    user_id = profile?.id ?? null
    username = profile?.name ?? null
    avatar_url = profile?.picture?.data?.url ?? null
  } catch { /* non-fatal */ }

  return { access_token, expires_at, username, avatar_url, user_id, raw }
}

// ── Threads (separate app from Meta) ──────────────────────────────────────────

export function buildThreadsAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.THREADS_APP_ID!,
    redirect_uri: `${appUrl()}/oauth/threads`,
    scope: 'threads_basic,threads_content_publish',
    response_type: 'code',
    state,
  })
  return `https://threads.net/oauth/authorize?${params}`
}

export async function exchangeThreadsCode(code: string): Promise<{
  access_token: string
  expires_at: string | null
  username: string | null
  avatar_url: string | null
  user_id: string | null
  scopes: string[]
  raw: unknown
}> {
  // Step 1: short-lived token
  const shortRes = await fetch('https://graph.threads.net/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.THREADS_APP_ID!,
      client_secret: process.env.THREADS_APP_SECRET!,
      redirect_uri: `${appUrl()}/oauth/threads`,
      code,
      grant_type: 'authorization_code',
    }),
  })
  const shortRaw = await shortRes.json()
  if (!shortRes.ok) throw new Error(`Threads short-lived token failed: ${JSON.stringify(shortRaw)}`)

  // Step 2: long-lived token (60 days)
  const longParams = new URLSearchParams({
    grant_type: 'th_exchange_token',
    client_secret: process.env.THREADS_APP_SECRET!,
    access_token: shortRaw.access_token,
  })
  const longRes = await fetch(
    `https://graph.threads.net/access_token?${longParams}`
  )
  const raw = await longRes.json()
  if (!longRes.ok) throw new Error(`Threads long-lived token failed: ${JSON.stringify(raw)}`)

  const { access_token, expires_in } = raw
  const expires_at = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null

  // Fetch profile
  let username: string | null = null
  let avatar_url: string | null = null
  let user_id: string | null = null
  const scopes = ['threads_basic', 'threads_content_publish']
  try {
    const profileRes = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${access_token}`
    )
    const profile = await profileRes.json()
    user_id = profile?.id ?? null
    username = profile?.username ?? null
    avatar_url = profile?.threads_profile_picture_url ?? null
  } catch { /* non-fatal */ }

  return { access_token, expires_at, username, avatar_url, user_id, scopes, raw }
}
