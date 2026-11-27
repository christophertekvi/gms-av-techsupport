import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import AdminNavStatus from './AdminNavStatus'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/icon.png"
            alt="GMS Logo"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-contain group-hover:scale-105 transition-transform"
            priority
          />
          <span className="font-display font-semibold text-[15px]">
            GMS Multimedia
          </span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <AdminNavStatus />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
