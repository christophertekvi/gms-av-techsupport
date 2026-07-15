import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles')

export function getAllSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    title: data.title || slug,
    category: data.category || 'lainnya',
    wilayah: data.wilayah || null,
    description: data.description || '',
    tags: data.tags || [],
    updatedAt: data.updatedAt || null,
    equipment: data.equipment || [],
  }
}

export function getAllArticles() {
  return getAllSlugs()
    .map(getArticleBySlug)
    .filter(Boolean)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

export function getArticlesByCategory(categorySlug) {
  return getAllArticles().filter((a) => a.category === categorySlug)
}

export function getArticlesByWilayah(wilayahSlug) {
  return getAllArticles().filter((a) => a.wilayah === wilayahSlug)
}

export function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function buildFrontmatter({
  title,
  category,
  wilayah,
  description,
  tags,
  equipment,
  updatedAt,
}) {
  const fm = {
    title,
    category,
    description: description || '',
    tags: tags || [],
    equipment: equipment || [],
    updatedAt: updatedAt || new Date().toISOString().slice(0, 10),
  }
  if (wilayah) fm.wilayah = wilayah
  return fm
}

export function stringifyArticle(frontmatter, content) {
  return matter.stringify(content || '', frontmatter)
}
