import Sidebar from '@/components/Sidebar'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory } from '@/lib/articles'
import { getCategory, CATEGORIES } from '@/lib/categories'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export default function CategoryPage({ params }) {
  const category = getCategory(params.slug)
  if (!category) notFound()
  const articles = getArticlesByCategory(params.slug)

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">Kategori</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
          {category.label}
        </h1>
        <p className="text-muted-light dark:text-muted-dark">{category.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeCategory={params.slug} />
        <div className="flex-1 min-w-0">
          {articles.length === 0 ? (
            <div className="rounded-md border border-dashed border-border-light dark:border-border-dark p-10 text-center text-sm text-muted-light dark:text-muted-dark">
              Belum ada artikel di kategori ini.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
