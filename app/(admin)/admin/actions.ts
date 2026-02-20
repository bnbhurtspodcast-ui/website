'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { Task } from '@/types'

export async function updateContactStatus(id: string, status: string, reviewedBy?: string) {
  const supabase = await createClient()
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy
  await supabase.from('contact_submissions').update(updates).eq('id', id)
  revalidatePath('/admin/contacts')
}

export async function reviewContactSubmission(id: string, reviewedBy: string) {
  const supabase = await createClient()
  await supabase
    .from('contact_submissions')
    .update({ status: 'reviewed', reviewed_by: reviewedBy, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'new')
  revalidatePath('/admin/contacts')
}

export async function deleteContactSubmission(id: string) {
  const supabase = await createClient()
  await supabase.from('contact_submissions').delete().eq('id', id)
  revalidatePath('/admin/contacts')
}

export async function updateGuestStatus(id: string, status: string, reviewedBy?: string) {
  const supabase = await createClient()
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy
  await supabase.from('guest_applications').update(updates).eq('id', id)
  revalidatePath('/admin/guests')
}

export async function reviewGuestApplication(id: string, reviewedBy: string) {
  const supabase = await createClient()
  await supabase
    .from('guest_applications')
    .update({ status: 'reviewing', reviewed_by: reviewedBy, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'pending')
  revalidatePath('/admin/guests')
}

export async function deleteGuestApplication(id: string) {
  const supabase = await createClient()
  await supabase.from('guest_applications').delete().eq('id', id)
  revalidatePath('/admin/guests')
}

export async function updateSponsorshipStatus(id: string, status: string, reviewedBy?: string) {
  const supabase = await createClient()
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (reviewedBy !== undefined) updates.reviewed_by = reviewedBy
  await supabase.from('sponsorship_inquiries').update(updates).eq('id', id)
  revalidatePath('/admin/sponsorships')
}

export async function reviewSponsorshipInquiry(id: string, reviewedBy: string) {
  const supabase = await createClient()
  await supabase
    .from('sponsorship_inquiries')
    .update({ status: 'reviewing', reviewed_by: reviewedBy, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'new')
  revalidatePath('/admin/sponsorships')
}

export async function deleteSponsorshipInquiry(id: string) {
  const supabase = await createClient()
  await supabase.from('sponsorship_inquiries').delete().eq('id', id)
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
  assignee?: string
  assignee_user_id?: string
  due_date?: string
  label_color?: string
}) {
  const supabase = await createClient()
  await supabase.from('tasks').insert({
    title:            data.title,
    description:      data.description,
    column_id:        data.column_id,
    priority:         data.priority,
    assignee:         data.assignee ?? null,
    assignee_user_id: data.assignee_user_id ?? null,
    due_date:         data.due_date ?? null,
    label_color:      data.label_color ?? null,
    tags:             [],
    sort_order:       0,
  })
  revalidatePath('/admin/tasks')
}

export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'assignee' | 'assignee_user_id' | 'due_date' | 'label_color' | 'column_id' | 'tags'>>
) {
  const supabase = await createClient()
  await supabase.from('tasks').update(data).eq('id', id)
  revalidatePath('/admin/tasks')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', id)
  revalidatePath('/admin/tasks')
}

export async function getUsers(): Promise<{
  users?: { id: string; email: string; name: string }[]
  error?: string
}> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return { error: error.message }
  const users = (data.users ?? []).map((u) => ({
    id:    u.id,
    email: u.email ?? '',
    name:  (u.user_metadata?.full_name as string | undefined)
           ?? (u.user_metadata?.name as string | undefined)
           ?? u.email
           ?? u.id,
  }))
  return { users }
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
