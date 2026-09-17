import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { transitionBroadcast } from '@/lib/youtube'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

export async function POST(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    return NextResponse.json({ error: 'Broadcast ID tidak ditemukan.' }, { status: 400 })
  }

  try {
    const { status } = await req.json()
    if (!status) {
      return NextResponse.json({ error: 'Status transisi wajib diisi.' }, { status: 400 })
    }

    const result = await transitionBroadcast(id, status)
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    console.error('Error transitionBroadcast:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal mengubah status siaran.' },
      { status: err.status || 500 }
    )
  }
}
