import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getStoredTokens, clearTokens, getOAuthUrl, getChannelProfile } from '@/lib/youtube'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

export async function GET(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  // Cek apakah credentials diatur di .env.local
  const isConfigured = !!(process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET)

  // Jika action = login, generate redirect URL ke Google OAuth
  if (action === 'login') {
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'YOUTUBE_CLIENT_ID dan YOUTUBE_CLIENT_SECRET belum diatur di .env.local.' },
        { status: 400 }
      )
    }

    const host = req.headers.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const redirectUri = `${protocol}://${host}/api/youtube/callback`

    try {
      const authUrl = getOAuthUrl(redirectUri)
      return NextResponse.redirect(authUrl)
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // Cek status koneksi YouTube
  const tokens = getStoredTokens()
  const hasRefreshToken = !!tokens?.refresh_token

  let channel = null
  let authError = null

  if (hasRefreshToken && isConfigured) {
    try {
      channel = await getChannelProfile()
    } catch (err) {
      authError = err.message
    }
  }

  return NextResponse.json({
    isConfigured,
    connected: !!channel,
    channel,
    authError,
  })
}

export async function DELETE() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  clearTokens()
  return NextResponse.json({ ok: true, message: 'Koneksi channel YouTube berhasil diputuskan.' })
}
