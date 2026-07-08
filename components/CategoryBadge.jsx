import Link from 'next/link'
import { getCategory } from '@/lib/categories'

export default function CategoryBadge({ slug }) {
  const category = getCategory(slug)
  if (!category) return null
  return (
    <Link
      href={`/kategori/${slug}`}
      className="inline-flex items-center rounded-sm border border-border-light dark:border-border-dark px-2 py-0.5 text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark hover:text-accent hover:border-accent transition-colors"
    >
      {category.label}
    </Link>
  )
}
