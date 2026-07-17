import Sidebar from '@/components/Sidebar'
import ArticleCard from '@/components/ArticleCard'
import MDXContent from '@/components/MDXContent'
import { getAllRooms, getRoomBySlug } from '@/lib/rooms'
import { getLocation } from '@/lib/locations'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function generateStaticParams() {
  const rooms = getAllRooms()
  return rooms
    .filter((r) => r.slug.includes('-'))
    .map((r) => {
      const parts = r.slug.split('-')
      const wilayah = parts[0]
      const roomSlug = parts.slice(1).join('-')
      return { slug: wilayah, roomSlug }
    })
}

export default function RoomDetailPage({ params }) {
  const location = getLocation(params.slug)
  if (!location) notFound()

  // Room slug in MDX is formatted as [wilayahSlug]-[roomSlug]
  const fullSlug = `${params.slug}-${params.roomSlug}`
  const room = getRoomBySlug(fullSlug)
  if (!room) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeLocation={fullSlug} />
        <div className="flex-1 min-w-0 max-w-3xl">
          <Link
            href={`/wilayah/${params.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-accent mb-6"
          >
            <ArrowLeft size={13} /> Kembali ke {location.label}
          </Link>

          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">
              Ruangan Tutorial · {location.label}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
              {room.name}
            </h1>
            {room.summary && (
              <p className="text-muted-light dark:text-muted-dark leading-7">
                {room.summary}
              </p>
            )}
          </div>

          {room.equipment && room.equipment.length > 0 && (
            <div className="mb-10 p-5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark mb-3">
                Inventaris Peralatan
              </h3>
              <ul className="divide-y divide-border-light dark:divide-border-dark">
                {room.equipment.map((eq, i) => (
                  <li key={i} className="py-2 flex justify-between items-center text-sm gap-2">
                    <span className="font-medium">{eq.name}</span>
                    {eq.notes && <span className="text-xs text-muted-light dark:text-muted-dark">{eq.notes}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {room.content && (
            <div className="mb-10 pb-8 border-b border-border-light dark:border-border-dark">
              <MDXContent source={room.content} />
            </div>
          )}

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark mb-4">
              Artikel Troubleshooting Terkait ({room.relatedArticles?.length || 0})
            </h2>
            {room.relatedArticles?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {room.relatedArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-light dark:text-muted-dark">
                Belum ada artikel yang ditandai khusus untuk ruangan ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
