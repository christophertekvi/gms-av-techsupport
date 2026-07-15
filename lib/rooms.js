import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getArticlesByLocation } from './articles'

const ROOMS_DIR = path.join(process.cwd(), 'content', 'rooms')

export function getAllRoomSlugs() {
  if (!fs.existsSync(ROOMS_DIR)) return []
  return fs
    .readdirSync(ROOMS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getRoomBySlug(slug) {
  const filePath = path.join(ROOMS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    name: data.name || slug,
    summary: data.summary || '',
    equipment: data.equipment || [], // [{ name, notes }]
    updatedAt: data.updatedAt || null,
    relatedArticles: getArticlesByLocation(slug),
  }
}

export function getAllRooms() {
  return getAllRoomSlugs()
    .map(getRoomBySlug)
    .filter(Boolean)
}

export function buildRoomFrontmatter({ name, summary, equipment, updatedAt }) {
  return {
    name,
    summary: summary || '',
    equipment: equipment || [],
    updatedAt: updatedAt || new Date().toISOString().slice(0, 10),
  }
}

export function stringifyRoom(frontmatter, content) {
  return matter.stringify(content || '', frontmatter)
}
