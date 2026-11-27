'use client'

import { useEffect, useState } from 'react'
import { Loader2, LogOut, Radio } from 'lucide-react'
import LiveStreamingTab from '@/components/admin/LiveStreamingTab'

export default function HomePage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    function checkAuth() {
      fetch('/api/auth', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => {
          setAuthed(!!d.authed)
          setUser(d.authed ? d.user : null)
        })
        .catch(() => {
          setAuthed(false)
          setUser(null)
        })
        .finally(() => setChecking(false))
    }

    checkAuth()

    const interval = setInterval(checkAuth, 60 * 1000)
    window.addEventListener('focus', checkAuth)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', checkAuth)
    }
  }, [])

  if (checking) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-24 flex justify-center">
        <Loader2 className="animate-spin text-muted-light dark:text-muted-dark" size={22} />
      </main>
    )
  }

  return authed ? (
    <LiveStreamingDashboard
      user={user}
      onLogout={() => {
        setAuthed(false)
        setUser(null)
        window.dispatchEvent(new Event('av-auth-change'))
      }}
    />
  ) : (
    <LoginForm
      onSuccess={(loggedInUser) => {
        setAuthed(true)
        setUser(loggedInUser || null)
        window.dispatchEvent(new Event('av-auth-change'))
      }}
    />
  )
}

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) {
        setError(data.error || 'Gagal login.')
        return
      }
      onSuccess(data.user)
    } catch {
      setLoading(false)
      setError('Terjadi kesalahan koneksi.')
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center">
            <Radio size={18} />
          </div>
          <h1 className="font-display text-xl font-semibold">Masuk ke Live Manager</h1>
        </div>
        <p className="text-xs text-muted-light dark:text-muted-dark mb-5">
          Silakan masuk menggunakan akun tim multimedia untuk mengelola YouTube Live Streaming.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-accent text-white text-sm font-medium py-2 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={14} />}
            Masuk
          </button>
        </form>
      </div>
    </main>
  )
}

function LiveStreamingDashboard({ user, onLogout }) {
  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    onLogout()
  }

  return (
    <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-light dark:border-border-dark">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2.5">
            <Radio size={20} className="text-red-500 animate-pulse" />
            <span>YouTube Live Streaming Manager</span>
          </h1>
          <p className="text-sm text-muted-light dark:text-muted-dark mt-0.5">
            Kelola jadwal siaran, mulai/hentikan live stream, dan pantau status encoder GMS Multimedia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-muted-light dark:text-muted-dark">
              Masuk sebagai <strong className="text-ink-light dark:text-ink-dark">{user.name || user.username}</strong>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border-light dark:border-border-dark text-xs font-medium text-muted-light dark:text-muted-dark hover:text-red-500 hover:border-red-500/40 transition-colors"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </div>

      <LiveStreamingTab />
    </main>
  )
}
