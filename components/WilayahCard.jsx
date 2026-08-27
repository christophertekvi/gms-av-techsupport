import Link from 'next/link'
import { MapPin, ChevronRight, Layers } from 'lucide-react'

export default function WilayahCard({ location, rooms = [] }) {
  const wilayahRooms = rooms.filter((r) => r.wilayah === location.slug)
  const articleCount = wilayahRooms.reduce(
    (acc, r) => acc + (r.relatedArticles?.length || 0),
    0
  )

  return (
    <div className="rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 flex flex-col justify-between hover:border-accent/50 transition-all duration-300 shadow-sm">
      <div>
        <Link
          href={`/wilayah/${location.slug}`}
          className="flex items-center justify-between mb-3 group/header"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-accent-soft dark:bg-accent-softDark text-accent shrink-0 group-hover/header:bg-accent group-hover/header:text-white transition-colors">
              <MapPin size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold leading-tight group-hover/header:text-accent transition-colors">
                {location.label}
              </h3>
              <p className="text-xs text-muted-light dark:text-muted-dark font-mono mt-0.5">{location.description}</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-light dark:text-muted-dark group-hover/header:text-accent group-hover/header:translate-x-0.5 transition-transform shrink-0" />
        </Link>

        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark space-y-2.5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-light dark:text-muted-dark mb-1">
            Daftar Ruangan ({wilayahRooms.length})
          </p>
          {wilayahRooms.length === 0 ? (
            <p className="text-xs text-muted-light dark:text-muted-dark italic">
              Belum ada ruangan terdaftar di wilayah ini.
            </p>
          ) : (
            <div className="grid gap-2">
              {wilayahRooms.map((room) => {
                const roomSlug = room.slug.includes('-')
                  ? room.slug.split('-').slice(1).join('-')
                  : room.slug
                return (
                  <Link
                    key={room.slug}
                    href={`/wilayah/${location.slug}/${roomSlug}`}
                    className="flex items-center justify-between p-2.5 rounded bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-accent hover:bg-accent-soft/30 dark:hover:bg-accent-softDark/20 transition-all group"
                  >
                    <span className="text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-2 truncate">
                      <Layers size={13} className="text-muted-light dark:text-muted-dark group-hover:text-accent shrink-0" />
                      <span className="truncate">{room.name}</span>
                    </span>
                    <ChevronRight size={14} className="text-muted-light dark:text-muted-dark group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center">
        <Link
          href={`/wilayah/${location.slug}`}
          className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
        >
          Detail Wilayah <ChevronRight size={12} />
        </Link>
        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
          {articleCount} artikel troubleshooting
        </p>
      </div>
    </div>
  )
}
