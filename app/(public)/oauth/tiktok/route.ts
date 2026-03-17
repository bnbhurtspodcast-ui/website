import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeTikTokCode } from '@/lib/oauth'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const cookieState = request.cookies.get('oauth_state')?.value
  const codeVerifier = request.cookies.get('oauth_code_verifier')?.value
  const returnTo = request.cookies.get('oauth_return')?.value ?? 'admin'

  const redirectBase =
    returnTo === 'demo'
      ? '/social-media-demo'
      : '/admin/social-media'

  if (error) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?oauth_error=${encodeURIComponent(error)}`, request.url)
    )
  }

  if (!code || !state || state !== cookieState || !codeVerifier) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?oauth_error=invalid_state`, request.url)
    )
  }

  try {
    const token = await exchangeTikTokCode(code, codeVerifier)
    const supabase = createAdminClient()
    await supabase.from('social_tokens').upsert(
      {
        platform: 'tiktok',
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_at,
        platform_user_id: token.user_id,
        platform_username: token.username,
        platform_avatar_url: token.avatar_url,
        scopes: token.scopes,
        raw_token_response: token.raw as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'platform' }
    )

    const response = NextResponse.redirect(
      new URL(`${redirectBase}?connected=tiktok`, request.url)
    )
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_code_verifier')
    response.cookies.delete('oauth_return')
    return response
  } catch (err) {
    console.error('TikTok OAuth error:', err)
    return NextResponse.redirect(
      new URL(`${redirectBase}?oauth_error=token_exchange_failed`, request.url)
    )
  }
}
