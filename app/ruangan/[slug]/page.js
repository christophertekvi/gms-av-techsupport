import Sidebar from '@/components/Sidebar'
import ArticleCard from '@/components/ArticleCard'
import MDXContent from '@/components/MDXContent'
import { getAllRoomSlugs, getRoomBySlug } from '@/lib/rooms'
import { getLocation, LOCATIONS } from '@/lib/locations'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }))
}

export default function RoomPage({ params }) {
  const location = getLocation(params.slug)
  if (!location) notFound()
  const room = getRoomBySlug(params.slug)

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeLocation={params.slug} />
        <div className="flex-1 min-w-0 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">Ruangan</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
            {room?.name || location.label}
          </h1>
          {room?.summary && (
            <p className="text-muted-light dark:text-muted-dark leading-7 mb-6">
              {room.summary}
            </p>
          )}

          {room?.content && (
            <div className="mb-10 pb-8 border-b border-border-light dark:border-border-dark">
              <MDXContent source={room.content} />
            </div>
          )}

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark mb-4">
              Artikel Troubleshooting Terkait ({room?.relatedArticles?.length || 0})
            </h2>
            {room?.relatedArticles?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {room.relatedArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-light dark:text-muted-dark">
                Belum ada artikel yang ditandai untuk ruangan ini. Saat menambah artikel di
                admin, pilih ruangan &quot;{location.label}&quot; supaya muncul di sini.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
