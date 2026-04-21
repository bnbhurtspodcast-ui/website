import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SocialMediaClient } from '@/app/(admin)/admin/social-media/SocialMediaClient'
import type { SocialPost, SocialToken } from '@/types'

export const revalidate = 0

export default async function SocialMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; oauth_error?: string }>
}) {
  notFound()
  const supabase = await createClient()
  const params = await searchParams

  const [{ data: posts }, { data: tokens }] = await Promise.all([
    supabase.from('social_posts').select('*').order('scheduled_at', { ascending: false }),
    supabase.from('social_tokens').select('*').order('platform'),
  ])

  return (
    <SocialMediaClient
      posts={(posts as SocialPost[]) ?? []}
      tokens={(tokens as SocialToken[]) ?? []}
      connected={params.connected}
      oauthError={params.oauth_error}
    />
  )
}
