'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminNavStatus() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    function checkSession() {
      fetch('/api/auth', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => setUser(d.authed ? d.user : null))
        .catch(() => setUser(null))
    }

    checkSession()
    window.addEventListener('av-auth-change', checkSession)
    window.addEventListener('focus', checkSession)
    return () => {
      window.removeEventListener('av-auth-change', checkSession)
      window.removeEventListener('focus', checkSession)
    }
  }, [])

  if (!user) return null

  return (
    <Link
      href="/"
      title={`Login sebagai ${user.name || user.username} (${user.role || 'admin'})`}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:border-emerald-500/60 transition-colors max-w-[160px]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      <span className="truncate">{user.name || user.username}</span>
    </Link>
  )
}
