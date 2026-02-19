'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateContactStatus(id: string, status: string) {
  const supabase = await createClient()
  await supabase
    .from('contact_submissions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/contacts')
}

export async function updateGuestStatus(id: string, status: string) {
  const supabase = await createClient()
  await supabase
    .from('guest_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/guests')
}

export async function updateSponsorshipStatus(id: string, status: string) {
  const supabase = await createClient()
  await supabase
    .from('sponsorship_inquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/sponsorships')
}

export async function updateTaskColumn(id: string, columnId: string) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ column_id: columnId }).eq('id', id)
  revalidatePath('/admin/tasks')
}

export async function createTask(data: {
  title: string
  description: string
  column_id: string
  priority: string
}) {
  const supabase = await createClient()
  await supabase.from('tasks').insert(data)
  revalidatePath('/admin/tasks')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', id)
  revalidatePath('/admin/tasks')
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()

  // Re-authenticate with current password to verify it
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Not authenticated' }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (signInError) return { error: 'Current password is incorrect' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { success: true }
}
