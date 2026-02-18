'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitSponsorshipInquiry(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('sponsorship_inquiries').insert({
    company_name: formData.get('companyName') as string,
    contact_name: formData.get('contactName') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || null,
    website: (formData.get('website') as string) || null,
    budget: (formData.get('budget') as string) || null,
    goals: formData.get('goals') as string,
    message: (formData.get('message') as string) || null,
  })

  if (error) {
    console.error('Sponsorship inquiry error:', error)
    redirect('/sponsorship?error=true')
  }

  redirect('/sponsorship?success=true')
}
