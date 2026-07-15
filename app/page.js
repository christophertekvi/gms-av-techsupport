import Sidebar from '@/components/Sidebar'
import ArticleCard from '@/components/ArticleCard'
import { getAllArticles } from '@/lib/articles'
import { CATEGORIES } from '@/lib/categories'
import Link from 'next/link'

export default function HomePage() {
  const articles = getAllArticles()

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <section className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">
          GMS Multimedia
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Troubleshooting &amp; tutorial peralatan Multimedia GMS.
        </h1>
        <p className="text-muted-light dark:text-muted-dark leading-7">
          Kumpulan solusi untuk masalah kamera, switcher, streaming, audio, dan display
          yang sering muncul saat produksi live. Tutorial ruangan, dan bagaimana cara mengoperasikan peralatan Multimedia GMS.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {articles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
                  Semua Artikel ({articles.length})
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </>
          )}

          <section className="mt-12">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark mb-4">
              Jelajahi per Kategori
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  className="rounded-md border border-border-light dark:border-border-dark p-4 hover:border-accent transition-colors"
                >
                  <p className="font-display font-semibold text-sm mb-1">{cat.label}</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark leading-5">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-border-light dark:border-border-dark p-10 text-center">
      <p className="font-display font-semibold mb-1">Belum ada artikel</p>
      <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
        Tambahkan artikel pertama lewat panel admin untuk mulai mengisi dokumentasi.
      </p>
      <Link href="/admin" className="text-accent text-sm underline underline-offset-2">
        Buka panel admin
      </Link>
    </div>
  )
}
