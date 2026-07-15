import Link from 'next/link'
import { getCategory } from '@/lib/categories'
import { getLocation } from '@/lib/locations'

export default function ArticleCard({ article }) {
  const category = getCategory(article.category)
  const location = getLocation(article.location)
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group block rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark">
          {category?.label || article.category}
        </span>
        {location && (
          <span className="text-[11px] font-mono uppercase tracking-wide text-accent">
            {location.label}
          </span>
        )}
      </div>
      <h3 className="font-display text-base font-semibold mb-1.5 group-hover:text-accent transition-colors">
        {article.title}
      </h3>
      {article.description && (
        <p className="text-sm text-muted-light dark:text-muted-dark leading-6 line-clamp-2">
          {article.description}
        </p>
      )}
      {article.equipment?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {article.equipment.slice(0, 3).map((eq) => (
            <span
              key={eq}
              className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-bg-light dark:bg-bg-dark text-muted-light dark:text-muted-dark"
            >
              {eq}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
