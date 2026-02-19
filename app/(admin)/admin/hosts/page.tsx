import { createClient } from '@/lib/supabase/server'
import { HostsClient } from './HostsClient'
import type { Host } from '@/types'

export default async function HostsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hosts')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return <HostsClient hosts={(data as Host[]) ?? []} />
}
