import { createClient } from '@/lib/supabase/server'
import { SocialMediaClient } from '@/app/(admin)/admin/social-media/SocialMediaClient'
import type { SocialPost } from '@/types'

export const revalidate = 0

export default async function SocialMediaPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('social_posts')
    .select('*')
    .order('scheduled_at', { ascending: false })

  return <SocialMediaClient posts={(data as SocialPost[]) ?? []} />
}
