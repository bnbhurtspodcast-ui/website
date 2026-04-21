import { createClient } from '@/lib/supabase/server'
import { InvitationsClient } from '@/app/(admin)/admin/invitations/InvitationsClient'
import type { Invitation } from '@/types'

export const revalidate = 0

export default async function InvitationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  return <InvitationsClient invitations={(data as Invitation[]) ?? []} />
}
