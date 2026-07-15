import Sidebar from '@/components/Sidebar'
import CategoryBadge from '@/components/CategoryBadge'
import MDXContent from '@/components/MDXContent'
import { getAllSlugs, getArticleBySlug } from '@/lib/articles'
import { getWilayah } from '@/lib/categories'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — GMS Multimedia Docs`,
    description: article.description,
  }
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()
  const wilayah = article.wilayah ? getWilayah(article.wilayah) : null

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeCategory={article.category} activeWilayah={article.wilayah} />
        <article className="flex-1 min-w-0 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-accent mb-6"
          >
            <ArrowLeft size={13} /> Kembali ke semua artikel
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <CategoryBadge slug={article.category} />
            {wilayah && (
              <Link
                href={`/wilayah/${article.wilayah}`}
                className="inline-flex items-center rounded-sm border border-border-light dark:border-border-dark px-2 py-0.5 text-xs font-mono uppercase tracking-wide text-accent hover:border-accent transition-colors"
              >
                {wilayah.label}
              </Link>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mb-3">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-muted-light dark:text-muted-dark leading-7 mb-4">
              {article.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-light dark:text-muted-dark mb-8 pb-6 border-b border-border-light dark:border-border-dark">
            {article.updatedAt && <span>Diperbarui {article.updatedAt}</span>}
            {article.equipment?.length > 0 && (
              <span className="font-mono">{article.equipment.join(' · ')}</span>
            )}
          </div>

          <MDXContent source={article.content} />

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border-light dark:border-border-dark">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-1 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
