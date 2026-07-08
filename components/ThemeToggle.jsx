'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) return <div className="h-8 w-8" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      className="h-8 w-8 flex items-center justify-center rounded-sm border border-border-light dark:border-border-dark hover:border-accent transition-colors"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
