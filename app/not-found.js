import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-tally-critical mb-3">
        404 — Sinyal hilang
      </p>
      <h1 className="font-display text-2xl font-semibold mb-3">Halaman tidak ditemukan</h1>
      <p className="text-muted-light dark:text-muted-dark mb-6">
        Artikel atau kategori yang kamu cari mungkin sudah dipindah atau belum dibuat.
      </p>
      <Link href="/" className="text-accent underline underline-offset-2 text-sm">
        Kembali ke beranda
      </Link>
    </main>
  )
}
