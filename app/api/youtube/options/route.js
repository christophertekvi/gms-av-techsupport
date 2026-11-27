import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { listExistingStreams, listPlaylists } from '@/lib/youtube'

const YOUTUBE_CATEGORIES = [
  { id: '29', label: 'Nonprofits & Activism (Gereja, Rohani & Organisasi)' },
  { id: '22', label: 'People & Blogs (Masyarakat & Warga)' },
  { id: '10', label: 'Music (Pujian & Penyembahan)' },
  { id: '27', label: 'Education (Pengajaran & Firman)' },
  { id: '24', label: 'Entertainment (Acara & Event)' },
  { id: '25', label: 'News & Politics (Berita & Informasi)' },
]

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized. Harap login admin.' }, { status: 401 })
  }

  try {
    const [streams, playlists] = await Promise.all([
      listExistingStreams().catch((err) => {
        console.warn('Gagal ambil streams:', err.message)
        return []
      }),
      listPlaylists().catch((err) => {
        console.warn('Gagal ambil playlists:', err.message)
        return []
      }),
    ])

    return NextResponse.json({
      streams,
      playlists,
      categories: YOUTUBE_CATEGORIES,
    })
  } catch (err) {
    console.error('Error fetching YouTube options:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil opsi YouTube.' },
      { status: 500 }
    )
  }
}
