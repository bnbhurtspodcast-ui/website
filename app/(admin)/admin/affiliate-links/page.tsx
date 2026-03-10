import { createClient } from '@/lib/supabase/server'
import { AffiliateLinksClient } from '@/app/(admin)/admin/affiliate-links/AffiliateLinksClient'
import type { AffiliateLink } from '@/types'

export default async function AffiliateLinksPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('created_at', { ascending: false })

  return <AffiliateLinksClient links={(data as AffiliateLink[]) ?? []} />
}
