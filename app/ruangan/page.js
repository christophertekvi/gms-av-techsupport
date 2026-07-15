import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { LOCATIONS } from '@/lib/locations'
import { getAllRooms } from '@/lib/rooms'

export default function RuanganListPage() {
  const rooms = getAllRooms()

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-accent mb-2">Ruangan</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
          Profil &amp; Tutorial per Ruangan
        </h1>
        <p className="text-muted-light dark:text-muted-dark max-w-xl">
          Daftar alat, SOP buka/tutup, dan artikel troubleshooting yang relevan untuk
          masing-masing ruangan produksi.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-4">
          {LOCATIONS.map((loc) => {
            const room = rooms.find((r) => r.slug === loc.slug)
            return (
              <Link
                key={loc.slug}
                href={`/ruangan/${loc.slug}`}
                className="rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-accent transition-colors"
              >
                <h3 className="font-display text-base font-semibold mb-1.5">{loc.label}</h3>
                <p className="text-sm text-muted-light dark:text-muted-dark leading-6 mb-3">
                  {room?.summary || loc.description}
                </p>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                  {room?.relatedArticles?.length || 0} artikel terkait
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
