import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllArticles, buildFrontmatter, stringifyArticle, slugify } from '@/lib/articles'
import { commitFile } from '@/lib/github'

export async function GET() {
  const articles = getAllArticles()
  return NextResponse.json({ articles })
}

function isAuthed() {
  const token = cookies().get('av_admin_session')?.value
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Tidak diizinkan. Silakan login dulu.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, category, location, description, tags, equipment, content, slug: customSlug } =
      body

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Judul, kategori, dan isi artikel wajib diisi.' },
        { status: 400 }
      )
    }

    const slug = slugify(customSlug || title)
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
      `docs: tambah artikel "${title}"`
    )

    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan artikel ke GitHub.' },
      { status: 500 }
    )
  }
}
