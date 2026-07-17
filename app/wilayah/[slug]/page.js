import Sidebar from '@/components/Sidebar'
import ArticleCard from '@/components/ArticleCard'
import { getAllRooms } from '@/lib/rooms'
import { getLocation, WILAYAH } from '@/lib/locations'
import { getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Layers, ArrowLeft } from 'lucide-react'

export function generateStaticParams() {
  return WILAYAH.map((w) => ({ slug: w.slug }))
}

export default function WilayahDetailPage({ params }) {
  const location = getLocation(params.slug)
  if (!location || location.parentSlug) notFound()

  const rooms = getAllRooms().filter((r) => r.wilayah === params.slug)
  const articles = getAllArticles()
  const wilayahArticles = articles.filter(
    (a) => a.location === params.slug || a.location?.startsWith(`${params.slug}-`)
  )

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeLocation={params.slug} />
        <div className="flex-1 min-w-0 max-w-3xl">
          <Link
            href="/wilayah"
            className="inline-flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-accent mb-6"
          >
            <ArrowLeft size={13} /> Kembali ke daftar wilayah
          </Link>

          <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">Wilayah</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
            {location.label}
          </h1>
          <p className="text-muted-light dark:text-muted-dark leading-7 mb-8">
            {location.description} — Kumpulan tutorial operasional ruangan dan panduan troubleshooting.
          </p>

          <div className="mb-10">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark mb-4">
              Daftar Ruangan di Wilayah Ini
            </h2>
            {rooms.length === 0 ? (
              <p className="text-sm text-muted-light dark:text-muted-dark italic">
                Belum ada ruangan terdaftar untuk wilayah ini. Tambahkan ruangan baru di panel admin.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {rooms.map((room) => {
                  const roomSlug = room.slug.includes('-')
                    ? room.slug.split('-').slice(1).join('-')
                    : room.slug
                  return (
                    <Link
                      key={room.slug}
                      href={`/wilayah/${params.slug}/${roomSlug}`}
                      className="rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-accent transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-display text-base font-semibold mb-1.5 flex items-center gap-2">
                          <Layers size={15} className="text-accent" />
                          {room.name}
                        </h3>
                        <p className="text-sm text-muted-light dark:text-muted-dark leading-6 line-clamp-2 mb-4">
                          {room.summary || 'Lihat tutorial dan SOP operasional ruangan.'}
                        </p>
                      </div>
                      <span className="text-xs text-accent font-medium hover:underline flex items-center gap-1 mt-auto">
                        Buka Tutorial <ChevronRight size={12} />
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark mb-4">
              Artikel Troubleshooting Terkait ({wilayahArticles.length})
            </h2>
            {wilayahArticles.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {wilayahArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-light dark:text-muted-dark">
                Belum ada artikel troubleshooting yang ditandai untuk wilayah ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
