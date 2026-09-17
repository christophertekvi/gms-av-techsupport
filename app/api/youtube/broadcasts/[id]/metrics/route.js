import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBroadcastMetrics } from '@/lib/youtube'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

export async function GET(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    return NextResponse.json({ error: 'Broadcast ID tidak ditemukan.' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const streamId = searchParams.get('streamId')

  try {
    const metrics = await getBroadcastMetrics(id, streamId)
    return NextResponse.json({ metrics })
  } catch (err) {
    console.error('Error getBroadcastMetrics:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil matrix siaran.' },
      { status: 500 }
    )
  }
}
