import { createClient } from '@/lib/supabase/server'
import { HostsClient } from './HostsClient'
import { getUsers } from '../actions'
import type { Host } from '@/types'

export default async function HostsPage() {
  const supabase = await createClient()
  const [{ data }, { users }] = await Promise.all([
    supabase
      .from('hosts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    getUsers(),
  ])

  return (
    <HostsClient
      hosts={(data as Host[]) ?? []}
      users={users ?? []}
    />
  )
}
