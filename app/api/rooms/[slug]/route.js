import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRoomBySlug, buildRoomFrontmatter, stringifyRoom } from '@/lib/rooms'
import { commitFile } from '@/lib/github'

function isAuthed() {
  const token = cookies().get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(_req, { params }) {
  const room = getRoomBySlug(params.slug)
  if (!room) return NextResponse.json({ error: 'Ruangan tidak ditemukan' }, { status: 404 })
  return NextResponse.json({ room })
}

export async function PUT(req, { params }) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { name, summary, equipment, content } = body
    const frontmatter = buildRoomFrontmatter({ name, summary, equipment })
    const fileContent = stringifyRoom(frontmatter, content)

    await commitFile(
      `content/rooms/${params.slug}.mdx`,
      fileContent,
      `docs: perbarui ruangan "${name}"`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui ruangan.' },
      { status: 500 }
    )
  }
}
