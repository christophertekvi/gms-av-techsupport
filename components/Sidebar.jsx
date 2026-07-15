import Link from 'next/link'
import { CATEGORIES, WILAYAH } from '@/lib/categories'

export default function Sidebar({ activeCategory, activeWilayah }) {
  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="lg:sticky lg:top-24 space-y-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-2 px-1">
            Wilayah
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/"
                className={`block rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                  !activeCategory && !activeWilayah
                    ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-medium'
                    : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                }`}
              >
                Semua
              </Link>
            </li>
            {WILAYAH.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/wilayah/${w.slug}`}
                  className={`block rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                    activeWilayah === w.slug
                      ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-medium'
                      : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                  }`}
                >
                  {w.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-2 px-1">
            Kategori
          </p>
          <ul className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className={`block rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-medium'
                      : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
