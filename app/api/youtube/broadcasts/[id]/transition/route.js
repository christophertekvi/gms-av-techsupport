import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { transitionBroadcast, youtubeFetch } from '@/lib/youtube'

/** Ambil lifecycle status broadcast langsung dari YouTube (fresh) */
async function fetchBroadcastLifecycle(broadcastId) {
  try {
    const data = await youtubeFetch(
      `liveBroadcasts?part=status,contentDetails&id=${broadcastId}`
    )
    const item = data.items?.[0]
    return {
      lifeCycleStatus: item?.status?.lifeCycleStatus || null,
      boundStreamId: item?.contentDetails?.boundStreamId || null,
    }
  } catch {
    return { lifeCycleStatus: null, boundStreamId: null }
  }
}

/** Ambil stream status langsung dari YouTube */
async function fetchStreamStatus(streamId) {
  if (!streamId) return null
  try {
    const data = await youtubeFetch(`liveStreams?part=status&id=${streamId}`)
    return data.items?.[0]?.status?.streamStatus || null
  } catch {
    return null
  }
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

  const { status: targetStatus } = await req.json()
  if (!targetStatus) {
    return NextResponse.json({ error: 'Status transisi wajib diisi.' }, { status: 400 })
  }

  // Ambil status terbaru dari YouTube sebelum mencoba transisi
  const { lifeCycleStatus, boundStreamId } = await fetchBroadcastLifecycle(id)

  // Jika targetStatus adalah 'live', lakukan validasi ketat
  if (targetStatus === 'live') {
    // Cek apakah encoder benar-benar mengirim stream (fresh dari YouTube)
    const streamStatus = await fetchStreamStatus(boundStreamId)

    if (streamStatus && streamStatus !== 'active') {
      return NextResponse.json(
        {
          error:
            `Encoder belum mengirim stream ke YouTube (status encoder: "${streamStatus}"). ` +
            'Pastikan switcher/OBS sudah mengalirkan video ke stream key ini, lalu coba lagi.',
        },
        { status: 400 }
      )
    }

    // Jika lifecycle masih 'created', encoder belum terdeteksi YouTube
    if (lifeCycleStatus === 'created') {
      return NextResponse.json(
        {
          error:
            'Siaran masih dalam status "created" — encoder belum terdeteksi oleh YouTube. ' +
            'Pastikan encoder sudah menyala dan mengirim stream, tunggu beberapa detik, lalu klik Refresh dan coba Go Live kembali.',
        },
        { status: 400 }
      )
    }

    // Langsung transisi ke 'live' tanpa melalui 'testing'
    if (lifeCycleStatus === 'ready' || lifeCycleStatus === 'testing') {
      try {
        const result = await transitionBroadcast(id, 'live')
        return NextResponse.json({
          ok: true,
          result,
          path: lifeCycleStatus === 'testing' ? 'from_testing' : 'direct',
        })
      } catch (err) {
        console.error(`Direct live transition failed (${lifeCycleStatus} -> live):`, err)
        return NextResponse.json(
          { error: err.message || 'Gagal Go Live.' },
          { status: err.status || 400 }
        )
      }
    }
  }

  // Untuk transisi lain (complete, testing) — jalankan langsung
  try {
    const result = await transitionBroadcast(id, targetStatus)
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    console.error('Error transitionBroadcast:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal mengubah status siaran.' },
      { status: err.status || 500 }
    )
  }
}
