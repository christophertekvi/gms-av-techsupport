import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionToken,
  getSessionUser,
  verifyUserCredentials,
} from '@/lib/auth'

export async function POST(req) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username dan password wajib diisi.' },
      { status: 400 }
    )
  }

  const user = verifyUserCredentials(username, password)
  if (!user) {
    return NextResponse.json(
      { error: 'Username atau password salah.' },
      { status: 401 }
    )
  }

  const token = createSessionToken(user)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return NextResponse.json({ ok: true, user })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const user = await getSessionUser()
  return NextResponse.json({ authed: !!user, user })
}
