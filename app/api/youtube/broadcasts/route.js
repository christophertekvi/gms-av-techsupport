import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { listBroadcasts, createBroadcastAndStream } from '@/lib/youtube'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  try {
    const broadcasts = await listBroadcasts()
    return NextResponse.json({ broadcasts })
  } catch (err) {
    console.error('Error listBroadcasts:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil data siaran YouTube.' },
      { status: err.status || 500 }
    )
  }
}

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      description,
      scheduledStartTime,
      privacyStatus,
      latencyPreference,
      enableAutoStart,
      enableAutoStop,
      enableDvr,
      streamId,
      playlistId,
      categoryId,
    } = body

    if (!title || !scheduledStartTime) {
      return NextResponse.json(
        { error: 'Judul dan Jadwal Mulai Siaran wajib diisi.' },
        { status: 400 }
      )
    }

    const result = await createBroadcastAndStream({
      title,
      description,
      scheduledStartTime,
      privacyStatus: privacyStatus || 'unlisted',
      latencyPreference: latencyPreference || 'normal',
      enableAutoStart: !!enableAutoStart,
      enableAutoStop: !!enableAutoStop,
      enableDvr: enableDvr !== false,
      streamId: streamId || null,
      playlistId: playlistId || null,
      categoryId: categoryId || null,
    })

    return NextResponse.json({ ok: true, stream: result })
  } catch (err) {
    console.error('Error createBroadcast:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal membuat upcoming stream.' },
      { status: err.status || 500 }
    )
  }
}
