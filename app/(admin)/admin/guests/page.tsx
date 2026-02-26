import { createClient } from '@/lib/supabase/server'
import { GuestsClient } from '@/app/(admin)/admin/guests/GuestsClient'

export default async function GuestsPage() {
  const supabase = await createClient()
  const { data: guests } = await supabase
    .from('guest_applications')
    .select('*')
    .order('created_at', { ascending: false })

  return <GuestsClient guests={guests ?? []} />
}
