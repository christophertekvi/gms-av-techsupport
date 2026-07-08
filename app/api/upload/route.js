import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { commitBinaryFile } from '@/lib/github'
import { slugify } from '@/lib/articles'

function isAuthed() {
  const token = cookies().get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const { filename, base64 } = await req.json()
    if (!filename || !base64) {
      return NextResponse.json({ error: 'File tidak lengkap.' }, { status: 400 })
    }
    const ext = filename.split('.').pop()
    const safeName = `${slugify(filename.replace(/\.[^/.]+$/, ''))}-${Date.now()}.${ext}`
    const path = `public/uploads/${safeName}`

    await commitBinaryFile(path, base64, `docs: upload gambar ${safeName}`)

    return NextResponse.json({ ok: true, url: `/uploads/${safeName}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Gagal upload gambar.' }, { status: 500 })
  }
}
