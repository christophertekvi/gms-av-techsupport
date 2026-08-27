import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getArticleBySlug, buildFrontmatter, stringifyArticle } from '@/lib/articles'
import { commitFile, deleteFile } from '@/lib/github'

async function isAuthed() {
  const cookieStore = await cookies()
  const token = cookieStore.get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(_req, { params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  return NextResponse.json({ article })
}

export async function PUT(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const { slug } = await params
    const body = await req.json()
    const { title, category, location, description, tags, equipment, content } = body

    const frontmatter = buildFrontmatter({
      title,
      category,
      location: location || null,
      description,
      tags: typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags,
      equipment:
        typeof equipment === 'string'
          ? equipment.split(',').map((t) => t.trim()).filter(Boolean)
          : equipment,
    })
    const fileContent = stringifyArticle(frontmatter, content)

    await commitFile(
      `content/articles/${slug}.mdx`,
      fileContent,
      `docs: perbarui artikel "${title}"`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui artikel.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    const { slug } = await params
    await deleteFile(`content/articles/${slug}.mdx`, `docs: hapus artikel "${slug}"`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Gagal menghapus artikel.' }, { status: 500 })
  }
}
