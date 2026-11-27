import { NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/youtube'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const host = req.headers.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/youtube/callback`

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, req.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=Tidak%20ada%20authorization%20code', req.url)
    )
  }

  try {
    await exchangeCode(code, redirectUri)
    return NextResponse.redirect(new URL('/?connected=1', req.url))
  } catch (err) {
    console.error('Gagal exchange OAuth code:', err)
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent(err.message || 'Gagal autentikasi YouTube')}`,
        req.url
      )
    )
  }
}
