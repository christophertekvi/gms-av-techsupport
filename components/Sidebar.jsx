import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { LOCATIONS } from '@/lib/locations'

export default function Sidebar({ activeCategory, activeLocation }) {
  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="lg:sticky lg:top-24 space-y-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-2 px-1">
            Kategori
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/"
                className={`block rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                  !activeCategory && !activeLocation
                    ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-medium'
                    : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                }`}
              >
                Semua Artikel
              </Link>
            </li>
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

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-2 px-1">
            Ruangan
          </p>
          <ul className="space-y-0.5">
            {LOCATIONS.map((loc) => (
              <li key={loc.slug}>
                <Link
                  href={`/ruangan/${loc.slug}`}
                  className={`block rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                    activeLocation === loc.slug
                      ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-medium'
                      : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                  }`}
                >
                  {loc.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
