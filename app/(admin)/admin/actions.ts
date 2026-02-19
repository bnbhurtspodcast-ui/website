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

type HostPayload = {
  name: string
  interests: string | null
  description: string | null
  social_links: { platform: string; url: string }[]
  photo_url?: string
}

export async function createHost(payload: HostPayload) {
  const supabase = await createClient()
  await supabase.from('hosts').insert({
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
    social_links: payload.social_links,
    photo_url: payload.photo_url ?? null,
    sort_order: 0,
  })
  revalidatePath('/admin/hosts')
  revalidatePath('/about')
}

export async function updateHost(id: string, payload: HostPayload) {
  const supabase = await createClient()
  const updates: Record<string, unknown> = {
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
    social_links: payload.social_links,
    updated_at: new Date().toISOString(),
  }
  if (payload.photo_url !== undefined) {
    updates.photo_url = payload.photo_url
  }
  await supabase.from('hosts').update(updates).eq('id', id)
  revalidatePath('/admin/hosts')
  revalidatePath('/about')
}

export async function deleteHost(id: string) {
  const supabase = await createClient()
  await supabase.from('hosts').delete().eq('id', id)
  revalidatePath('/admin/hosts')
  revalidatePath('/about')
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
