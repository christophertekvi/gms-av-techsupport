import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { commitBinaryFile } from '@/lib/github'
import { slugify } from '@/lib/articles'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await fs.mkdir(uploadsDir, { recursive: true })
      const entries = await fs.readdir(uploadsDir, { withFileTypes: true })
      const files = await Promise.all(
        entries
          .filter((e) => e.isFile() && !e.name.startsWith('.'))
          .map(async (e) => {
            const stat = await fs.stat(path.join(uploadsDir, e.name))
            return {
              name: e.name,
              url: `/uploads/${e.name}`,
              size: stat.size,
              mtime: stat.mtimeMs,
            }
          })
      )
      files.sort((a, b) => b.mtime - a.mtime)
      return NextResponse.json({ files })
    } catch {
      return NextResponse.json({ files: [] })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ files: [] })
  }
}

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const { filename, base64 } = await req.json()
    if (!filename || !base64) {
      return NextResponse.json({ error: 'File tidak lengkap.' }, { status: 400 })
    }
    const ext = filename.split('.').pop() || 'png'
    const safeName = `${slugify(filename.replace(/\.[^/.]+$/, ''))}-${Date.now()}.${ext}`
    const repoPath = `public/uploads/${safeName}`

    // Simpan ke direktori lokal bila memungkinkan
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      await fs.writeFile(path.join(uploadsDir, safeName), Buffer.from(base64, 'base64'))
    } catch (localErr) {
      console.warn('Gagal menyimpan file ke filesystem lokal:', localErr.message)
    }

    // Jika GITHUB_TOKEN diset, commit juga ke GitHub
    if (process.env.GITHUB_TOKEN) {
      await commitBinaryFile(repoPath, base64, `docs: upload gambar ${safeName}`)
    }

    return NextResponse.json({ ok: true, url: `/uploads/${safeName}`, name: safeName })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Gagal upload gambar.' }, { status: 500 })
  }
}

