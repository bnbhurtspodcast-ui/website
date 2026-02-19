import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the service role key.
 * Use ONLY in server actions — never in client components or public pages.
 * Required for operations like auth.admin.listUsers().
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
