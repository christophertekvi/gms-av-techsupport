import Link from 'next/link'
import { Radio, Settings } from 'lucide-react'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="h-7 w-7 rounded-sm bg-accent flex items-center justify-center">
            <Radio size={14} className="text-white" />
          </span>
          <span className="font-display font-semibold text-[15px] hidden sm:inline">
            GMS Church
          </span>
        </Link>

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin"
            aria-label="Panel admin"
            className="h-8 w-8 flex items-center justify-center rounded-sm border border-border-light dark:border-border-dark hover:border-accent transition-colors"
          >
            <Settings size={15} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
