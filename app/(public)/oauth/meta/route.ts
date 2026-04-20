import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeMetaCode } from '@/lib/oauth'

export async function GET(_request: NextRequest) {
  return new NextResponse(null, { status: 404 })
  const { searchParams } = _request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const cookieState = request.cookies.get('oauth_state')?.value
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

  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?oauth_error=invalid_state`, request.url)
    )
  }

  try {
    const token = await exchangeMetaCode(code)
    const supabase = createAdminClient()

    // Upsert only instagram — Threads has its own separate app and OAuth flow
    await supabase.from('social_tokens').upsert(
      {
        platform: 'instagram',
        access_token: token.access_token,
        refresh_token: null,
        expires_at: token.expires_at,
        platform_user_id: token.user_id,
        platform_username: token.username,
        platform_avatar_url: token.avatar_url,
        scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
        raw_token_response: token.raw as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'platform' }
    )

    const response = NextResponse.redirect(
      new URL(`${redirectBase}?connected=meta`, request.url)
    )
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_return')
    return response
  } catch (err) {
    console.error('Meta OAuth error:', err)
    return NextResponse.redirect(
      new URL(`${redirectBase}?oauth_error=token_exchange_failed`, request.url)
    )
  }
}
