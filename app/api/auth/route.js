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

  const cookieStore = await cookies()
  cookieStore.set('av_admin_session', password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('av_admin_session')
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return NextResponse.json({ authed: !!token && token === process.env.ADMIN_PASSWORD })
}
