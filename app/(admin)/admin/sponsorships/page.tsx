import { createClient } from '@/lib/supabase/server'
import { SponsorshipsClient } from '@/app/(admin)/admin/sponsorships/SponsorshipsClient'

export default async function SponsorshipsPage() {
  const supabase = await createClient()
  const { data: sponsorships } = await supabase
    .from('sponsorship_inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return <SponsorshipsClient sponsorships={sponsorships ?? []} />
}
