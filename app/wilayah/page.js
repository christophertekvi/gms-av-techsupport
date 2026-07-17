import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { WILAYAH } from '@/lib/locations'
import { getAllRooms } from '@/lib/rooms'
import { MapPin, ChevronRight, Layers } from 'lucide-react'

export default function WilayahListPage() {
  const rooms = getAllRooms()

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">Lokasi Produksi</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
          Profil &amp; Tutorial per Wilayah
        </h1>
        <p className="text-muted-light dark:text-muted-dark max-w-xl">
          Daftar wilayah gereja, ruangan produksi multimedia, SOP operasional, dan tutorial alat.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-6">
          {WILAYAH.map((loc) => {
            // Find rooms matching this wilayah (room.wilayah === loc.slug)
            const wilayahRooms = rooms.filter((r) => r.wilayah === loc.slug)

            return (
              <div
                key={loc.slug}
                className="rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 flex flex-col justify-between hover:border-accent/50 transition-all duration-300 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded bg-accent-soft dark:bg-accent-softDark text-accent">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold leading-tight">{loc.label}</h3>
                      <p className="text-xs text-muted-light dark:text-muted-dark font-mono mt-0.5">{loc.description}</p>
                    </div>
                  </div>

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
                              href={`/wilayah/${loc.slug}/${roomSlug}`}
                              className="flex items-center justify-between p-2.5 rounded bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-accent hover:bg-accent-soft/30 dark:hover:bg-accent-softDark/20 transition-all group"
                            >
                              <span className="text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-2">
                                <Layers size={13} className="text-muted-light dark:text-muted-dark group-hover:text-accent" />
                                {room.name}
                              </span>
                              <ChevronRight size={14} className="text-muted-light dark:text-muted-dark group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center">
                  <Link
                    href={`/wilayah/${loc.slug}`}
                    className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                  >
                    Detail Wilayah <ChevronRight size={12} />
                  </Link>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    {wilayahRooms.reduce((acc, r) => acc + (r.relatedArticles?.length || 0), 0)} artikel troubleshooting
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
