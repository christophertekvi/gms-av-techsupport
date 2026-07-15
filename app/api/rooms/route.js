import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllRooms, buildRoomFrontmatter, stringifyRoom } from '@/lib/rooms'
import { commitFile } from '@/lib/github'
import { slugify } from '@/lib/articles'

function isAuthed() {
  const token = cookies().get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const rooms = getAllRooms()
  return NextResponse.json({ rooms })
}

export async function POST(req) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { name, summary, equipment, content, slug: customSlug } = body
    if (!name) {
      return NextResponse.json({ error: 'Nama ruangan wajib diisi.' }, { status: 400 })
    }
    const slug = slugify(customSlug || name)
    const frontmatter = buildRoomFrontmatter({ name, summary, equipment })
    const fileContent = stringifyRoom(frontmatter, content)

    await commitFile(`content/rooms/${slug}.mdx`, fileContent, `docs: tambah ruangan "${name}"`)

    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan ruangan ke GitHub.' },
      { status: 500 }
    )
  }
}
