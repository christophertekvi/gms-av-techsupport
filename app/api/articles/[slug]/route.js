import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getArticleBySlug, buildFrontmatter, stringifyArticle } from '@/lib/articles'
import { commitFile, deleteFile } from '@/lib/github'

function isAuthed() {
  const token = cookies().get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(_req, { params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  return NextResponse.json({ article })
}

export async function PUT(req, { params }) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
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
      `content/articles/${params.slug}.mdx`,
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
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }
  try {
    await deleteFile(`content/articles/${params.slug}.mdx`, `docs: hapus artikel "${params.slug}"`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Gagal menghapus artikel.' }, { status: 500 })
  }
}
