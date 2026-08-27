import Sidebar from '@/components/Sidebar'
import WilayahCard from '@/components/WilayahCard'
import { WILAYAH } from '@/lib/locations'
import { getAllRooms } from '@/lib/rooms'

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
        <Sidebar rooms={rooms} />
        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-6">
          {WILAYAH.map((loc) => (
            <WilayahCard key={loc.slug} location={loc} rooms={rooms} />
          ))}
        </div>
      </div>
    </main>
  )
}
