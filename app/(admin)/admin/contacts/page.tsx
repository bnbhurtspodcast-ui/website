import { createClient } from '@/lib/supabase/server'
import { ContactsClient } from '@/app/(admin)/admin/contacts/ContactsClient'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: contacts } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return <ContactsClient contacts={contacts ?? []} />
}
