import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { transitionBroadcast, youtubeFetch } from '@/lib/youtube'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

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

    // Jika lifecycle adalah 'ready', coba langsung go live
    // Jika gagal, coba dua langkah: testing → live
    if (lifeCycleStatus === 'ready') {
      try {
        const result = await transitionBroadcast(id, 'live')
        return NextResponse.json({ ok: true, result, path: 'direct' })
      } catch (err) {
        // Langsung ke 'live' gagal — coba via 'testing' dahulu
        console.warn(`Direct live transition failed (${err.message}), trying testing → live...`)
        try {
          await transitionBroadcast(id, 'testing')
          // Tunggu sebentar agar YouTube memproses transisi ke testing
          await new Promise((r) => setTimeout(r, 2000))
          const result = await transitionBroadcast(id, 'live')
          return NextResponse.json({ ok: true, result, path: 'testing_then_live' })
        } catch (err2) {
          console.error('Fallback testing→live juga gagal:', err2)
          return NextResponse.json(
            {
              error:
                'Gagal Go Live. YouTube menolak transisi baik langsung maupun via testing. ' +
                'Kemungkinan encoder baru saja terhubung — tunggu 10-15 detik, klik Refresh, lalu coba lagi.',
            },
            { status: 400 }
          )
        }
      }
    }

    // Jika sudah di 'testing', langsung lanjut ke live
    if (lifeCycleStatus === 'testing') {
      try {
        const result = await transitionBroadcast(id, 'live')
        return NextResponse.json({ ok: true, result, path: 'from_testing' })
      } catch (err) {
        return NextResponse.json(
          { error: `Gagal transisi dari testing ke live: ${err.message}` },
          { status: 400 }
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
