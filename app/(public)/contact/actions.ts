'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('contact_submissions').insert({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  })

  if (error) {
    console.error('Contact form error:', error)
    redirect('/contact?error=true')
  }

  redirect('/contact?success=true')
}
