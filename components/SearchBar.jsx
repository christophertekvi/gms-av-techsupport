'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import TallyDot from './TallyDot'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState([])
  const [fuse, setFuse] = useState(null)
  const containerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => {
        setIndex(data.articles || [])
        setFuse(
          new Fuse(data.articles || [], {
            keys: ['title', 'description', 'tags', 'equipment'],
            threshold: 0.35,
          })
        )
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const results = query && fuse ? fuse.search(query).slice(0, 6).map((r) => r.item) : []

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2">
        <Search size={15} className="text-muted-light dark:text-muted-dark shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari masalah, alat, atau istilah..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-light dark:placeholder:text-muted-dark"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Bersihkan pencarian"
            className="text-muted-light dark:text-muted-dark hover:text-accent"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-light dark:text-muted-dark">
              Tidak ada artikel yang cocok dengan &quot;{query}&quot;.
            </p>
          ) : (
            results.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  setOpen(false)
                  setQuery('')
                  router.push(`/artikel/${item.slug}`)
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-bg-light dark:hover:bg-bg-dark border-b border-border-light dark:border-border-dark last:border-0 flex items-center gap-2"
              >
                <TallyDot severity={item.severity} />
                <span className="text-sm truncate">{item.title}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
