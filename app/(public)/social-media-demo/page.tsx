import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { SocialDemoClient } from '@/app/(public)/social-media-demo/SocialDemoClient'
import type { SocialToken } from '@/types'

export const revalidate = 0

export const metadata: Metadata = {
  title: "Social Media Integration Demo | Back n' Body Hurts Podcast",
  description:
    'Live demonstration of the OAuth 2.0 social media publishing integration for the Back n\' Body Hurts Podcast admin dashboard.',
  robots: { index: false, follow: false },
}

export default async function SocialMediaDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; oauth_error?: string }>
}) {
  const params = await searchParams

  // Use service role to read tokens — no auth required for the demo page
  const supabase = createAdminClient()
  const { data: tokens } = await supabase
    .from('social_tokens')
    .select('id, platform, platform_username, platform_avatar_url, scopes, updated_at')
    .order('platform')

  return (
    <SocialDemoClient
      tokens={(tokens as SocialToken[]) ?? []}
      connected={params.connected}
      oauthError={params.oauth_error}
    />
  )
}
