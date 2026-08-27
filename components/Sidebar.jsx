'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { WILAYAH } from '@/lib/locations'
import { Menu, X, ChevronDown, Layers, MapPin, Sparkles, BookOpen } from 'lucide-react'

export default function Sidebar({ activeCategory, activeLocation, rooms: initialRooms = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [rooms, setRooms] = useState(initialRooms)

  // If activeLocation is a room slug like "rooftop-ek-1", get parent slug ("rooftop")
  const parentLocation = activeLocation && activeLocation.includes('-')
    ? activeLocation.split('-')[0]
    : activeLocation

  // Automatically expand the active wilayah by default
  const [expanded, setExpanded] = useState(() => {
    const initial = {}
    if (parentLocation) {
      initial[parentLocation] = true
    }
    return initial
  })

  // Sync expanded state if activeLocation changes
  useEffect(() => {
    if (parentLocation) {
      setExpanded((prev) => ({ ...prev, [parentLocation]: true }))
    }
  }, [parentLocation])

  // If initialRooms wasn't provided, fetch from API
  useEffect(() => {
    if (!initialRooms || initialRooms.length === 0) {
      fetch('/api/rooms')
        .then((res) => res.json())
        .then((data) => {
          if (data.rooms) setRooms(data.rooms)
        })
        .catch(() => {})
    } else {
      setRooms(initialRooms)
    }
  }, [initialRooms])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleWilayah = (slug) => {
    setExpanded((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }))
  }

  const renderNavContent = () => (
    <div className="space-y-6">
      {/* Section Kategori */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-2.5 px-1 flex items-center gap-1.5">
          <BookOpen size={13} className="text-accent" /> Kategori
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
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
                onClick={() => setMobileOpen(false)}
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

      {/* Section Wilayah & Dropdown Ruangan */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark flex items-center gap-1.5">
            <MapPin size={13} className="text-accent" /> Wilayah &amp; Ruangan
          </p>
          <Link
            href="/wilayah"
            onClick={() => setMobileOpen(false)}
            className="text-[11px] text-accent hover:underline font-mono"
          >
            Semua
          </Link>
        </div>

        <ul className="space-y-1">
          {WILAYAH.map((loc) => {
            const locRooms = rooms.filter((r) => r.wilayah === loc.slug)
            const isParentActive = parentLocation === loc.slug
            const isExactWilayah = activeLocation === loc.slug
            const isExpanded = !!expanded[loc.slug]

            return (
              <li
                key={loc.slug}
                className="rounded-md border border-border-light/60 dark:border-border-dark/60 overflow-hidden bg-surface-light/40 dark:bg-surface-dark/40"
              >
                {/* Header item for Wilayah */}
                <div
                  className={`flex items-center justify-between px-2.5 py-2 text-sm transition-colors ${
                    isExactWilayah
                      ? 'bg-accent-soft dark:bg-accent-softDark text-accent font-semibold'
                      : isParentActive
                      ? 'text-accent font-medium bg-surface-light dark:bg-surface-dark'
                      : 'hover:bg-surface-light dark:hover:bg-surface-dark text-ink-light dark:text-ink-dark'
                  }`}
                >
                  <Link
                    href={`/wilayah/${loc.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 truncate pr-2 hover:underline"
                  >
                    {loc.label}
                  </Link>

                  {locRooms.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWilayah(loc.slug)
                      }}
                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-muted-light dark:text-muted-dark flex items-center gap-1 cursor-pointer"
                      aria-label={`Toggle ruangan ${loc.label}`}
                    >
                      <span className="text-[10px] font-mono opacity-80 px-1 py-0.5 rounded bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                        {locRooms.length}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-accent' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Dropdown list of rooms inside this Wilayah */}
                {isExpanded && locRooms.length > 0 && (
                  <ul className="border-t border-border-light/60 dark:border-border-dark/60 bg-bg-light/60 dark:bg-bg-dark/60 p-1 space-y-0.5">
                    {locRooms.map((room) => {
                      const roomSlug = room.slug.includes('-')
                        ? room.slug.split('-').slice(1).join('-')
                        : room.slug
                      const isRoomActive = activeLocation === room.slug

                      return (
                        <li key={room.slug}>
                          <Link
                            href={`/wilayah/${loc.slug}/${roomSlug}`}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors ${
                              isRoomActive
                                ? 'bg-accent text-white font-medium shadow-xs'
                                : 'hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
                            }`}
                          >
                            <Layers size={12} className={isRoomActive ? 'text-white' : 'text-accent shrink-0'} />
                            <span className="truncate">{room.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Burger Bar */}
      <div className="lg:hidden w-full mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-accent transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <Menu size={18} className="text-accent" />
            <span>Kategori &amp; Wilayah Ruangan</span>
          </div>
          <span className="text-xs font-mono text-muted-light dark:text-muted-dark bg-bg-light dark:bg-bg-dark px-2 py-0.5 rounded border border-border-light dark:border-border-dark">
            Buka Menu
          </span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative z-10 w-4/5 max-w-xs h-full bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <span className="font-display font-semibold text-sm">Navigasi</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark cursor-pointer"
                  aria-label="Tutup navigasi"
                >
                  <X size={18} />
                </button>
              </div>

              {renderNavContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <nav className="sticky top-24">
          {renderNavContent()}
        </nav>
      </aside>
    </>
  )
}
