import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  // Only handle password recovery tokens here
  if (token_hash && type === 'recovery') {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: 'recovery' })

    if (!error) {
      // Session is now set in cookies — send user to the reset page
      return NextResponse.redirect(new URL('/admin/reset-password', origin))
    }
  }

  // Anything else (bad token, wrong type) → back to signin with error
  return NextResponse.redirect(new URL('/admin/signin?error=invalid_reset_link', origin))
}
