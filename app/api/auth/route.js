import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  const { password } = await req.json()

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD belum di-set di environment variables.' },
      { status: 500 }
    )
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 })
  }

  cookies().set('av_admin_session', password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 3, // 3 hours (3 * 3600 seconds)
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  cookies().delete('av_admin_session')
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const token = cookies().get('av_admin_session')?.value
  return NextResponse.json({ authed: !!token && token === process.env.ADMIN_PASSWORD })
}
