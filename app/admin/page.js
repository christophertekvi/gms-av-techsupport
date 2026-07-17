'use client'

import { useEffect, useState, useRef } from 'react'
import { CATEGORIES } from '@/lib/categories'
import { WILAYAH } from '@/lib/locations'
import { Loader2, Upload, Trash2, Pencil, Plus, LogOut } from 'lucide-react'

const EMPTY_ARTICLE = {
  title: '',
  category: CATEGORIES[0].slug,
  location: '',
  description: '',
  tags: '',
  equipment: '',
  content: '',
}

const EMPTY_ROOM = {
  name: '',
  wilayah: '',
  summary: '',
  equipmentText: '',
  content: '',
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-20 flex justify-center">
        <Loader2 className="animate-spin text-muted-light dark:text-muted-dark" size={20} />
      </main>
    )
  }

  return authed ? (
    <AdminDashboard onLogout={() => setAuthed(false)} />
  ) : (
    <LoginForm onSuccess={() => setAuthed(true)} />
  )
}

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Gagal login.')
      return
    }
    onSuccess()
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-xl font-semibold mb-1">Masuk ke Admin</h1>
      <p className="text-sm text-muted-light dark:text-muted-dark mb-6">
        Khusus tim yang mengelola dokumentasi.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password admin"
          className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          autoFocus
        />
        {error && <p className="text-sm text-tally-critical">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-accent text-white text-sm font-medium py-2 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={14} />}
          Masuk
        </button>
      </form>
    </main>
  )
}

function MarkdownToolbar({ textareaRef, value, onChange }) {
  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const selectedText = text.substring(start, end)
    const replacement = before + selectedText + after

    const newValue = text.substring(0, start) + replacement + text.substring(end)
    onChange(newValue)

    // Reset cursor focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-t-sm border-t border-x border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
      <button
        type="button"
        title="Tebal (Bold)"
        onClick={() => insertFormatting('**', '**')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-bold border border-border-light dark:border-border-dark"
      >
        B
      </button>
      <button
        type="button"
        title="Miring (Italic)"
        onClick={() => insertFormatting('*', '*')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs italic border border-border-light dark:border-border-dark"
      >
        I
      </button>
      <div className="h-4 w-px bg-border-light dark:bg-border-dark mx-1" />
      <button
        type="button"
        title="Heading 1"
        onClick={() => insertFormatting('# ', '\n')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-mono border border-border-light dark:border-border-dark"
      >
        H1
      </button>
      <button
        type="button"
        title="Heading 2"
        onClick={() => insertFormatting('## ', '\n')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-mono border border-border-light dark:border-border-dark"
      >
        H2
      </button>
      <button
        type="button"
        title="Heading 3"
        onClick={() => insertFormatting('### ', '\n')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-mono border border-border-light dark:border-border-dark"
      >
        H3
      </button>
      <div className="h-4 w-px bg-border-light dark:bg-border-dark mx-1" />
      <button
        type="button"
        title="Daftar Bulat (Bullet List)"
        onClick={() => insertFormatting('- ', '\n')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs border border-border-light dark:border-border-dark"
      >
        • List
      </button>
      <button
        type="button"
        title="Daftar Nomor (Numbered List)"
        onClick={() => insertFormatting('1. ', '\n')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs border border-border-light dark:border-border-dark"
      >
        1. List
      </button>
      <div className="h-4 w-px bg-border-light dark:bg-border-dark mx-1" />
      <button
        type="button"
        title="Blok Kode (Code Block)"
        onClick={() => insertFormatting('```\n', '\n```')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-mono border border-border-light dark:border-border-dark"
      >
        Code
      </button>
      <button
        type="button"
        title="Tautan (Link)"
        onClick={() => insertFormatting('[', '](url)')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs text-accent font-medium border border-border-light dark:border-border-dark"
      >
        Link
      </button>
    </div>
  )
}

function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('articles') // articles | rooms
  const [articles, setArticles] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function refresh() {
    setLoading(true)
    Promise.all([
      fetch('/api/articles').then((r) => r.json()),
      fetch('/api/rooms').then((r) => r.json()),
    ])
      .then(([a, r]) => {
        setArticles(a.articles || [])
        setRooms(r.rooms || [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  async function handleDeleteArticle(slug) {
    if (!confirm(`Hapus artikel "${slug}"? Tindakan ini akan commit ke GitHub.`)) return
    const res = await fetch(`/api/articles/${slug}`, { method: 'DELETE' })
    if (res.ok) refresh()
    else alert('Gagal menghapus artikel.')
  }

  async function handleDeleteRoom(slug) {
    if (!confirm(`Hapus ruangan "${slug}"? Tindakan ini akan menghapus file tutorial MDX.`)) return
    const res = await fetch(`/api/rooms/${slug}`, { method: 'DELETE' })
    if (res.ok) refresh()
    else alert('Gagal menghapus ruangan.')
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    onLogout()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Panel Admin</h1>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            Kelola artikel &amp; wilayah/ruangan. Publish akan commit ke GitHub &amp; auto-deploy.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted-light dark:text-muted-dark hover:text-accent"
        >
          <LogOut size={14} /> Keluar
        </button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-border-light dark:border-border-dark">
        {['articles', 'rooms'].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setShowForm(false)
              setEditingSlug(null)
            }}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
            }`}
          >
            {t === 'articles' ? 'Artikel' : 'Ruangan'}
          </button>
        ))}
      </div>

      {showForm ? (
        tab === 'articles' ? (
          <ArticleForm
            rooms={rooms}
            initialSlug={editingSlug}
            onDone={() => {
              setShowForm(false)
              setEditingSlug(null)
              refresh()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingSlug(null)
            }}
          />
        ) : (
          <RoomForm
            initialSlug={editingSlug}
            onDone={() => {
              setShowForm(false)
              setEditingSlug(null)
              refresh()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingSlug(null)
            }}
          />
        )
      ) : (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-sm bg-accent text-white text-sm font-medium px-3 py-2 hover:opacity-90"
          >
            <Plus size={15} /> {tab === 'articles' ? 'Artikel Baru' : 'Ruangan Baru'}
          </button>

          {loading ? (
            <Loader2 className="animate-spin text-muted-light dark:text-muted-dark" size={18} />
          ) : tab === 'articles' ? (
            <div className="rounded-md border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
              {articles.length === 0 && (
                <p className="p-6 text-sm text-muted-light dark:text-muted-dark">
                  Belum ada artikel.
                </p>
              )}
              {articles.map((a) => (
                <div key={a.slug} className="flex items-center justify-between p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-light dark:text-muted-dark font-mono">
                      {a.category}
                      {a.location ? ` · ${a.location}` : ''} · {a.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setEditingSlug(a.slug)
                        setShowForm(true)
                      }}
                      aria-label="Edit"
                      className="text-muted-light dark:text-muted-dark hover:text-accent"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(a.slug)}
                      aria-label="Hapus"
                      className="text-muted-light dark:text-muted-dark hover:text-tally-critical"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {WILAYAH.map((wil) => {
                const wilRooms = rooms.filter((r) => r.wilayah === wil.slug)
                return (
                  <div key={wil.slug} className="border border-border-light dark:border-border-dark rounded-md overflow-hidden shadow-sm">
                    <div className="bg-bg-light dark:bg-bg-dark px-4 py-2 border-b border-border-light dark:border-border-dark">
                      <span className="font-display font-semibold text-xs uppercase tracking-wide text-muted-light dark:text-muted-dark">
                        {wil.label}
                      </span>
                    </div>
                    <div className="divide-y divide-border-light dark:divide-border-dark bg-surface-light dark:bg-surface-dark">
                      {wilRooms.length === 0 ? (
                        <p className="p-4 text-xs text-muted-light dark:text-muted-dark italic">
                          Belum ada ruangan di wilayah ini.
                        </p>
                      ) : (
                        wilRooms.map((r) => (
                          <div key={r.slug} className="flex items-center justify-between p-4">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{r.name}</p>
                              <p className="text-xs text-muted-light dark:text-muted-dark font-mono">
                                slug: {r.slug} · {r.relatedArticles?.length || 0} artikel terkait
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingSlug(r.slug)
                                  setShowForm(true)
                                }}
                                aria-label="Edit"
                                className="text-muted-light dark:text-muted-dark hover:text-accent"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(r.slug)}
                                aria-label="Hapus"
                                className="text-muted-light dark:text-muted-dark hover:text-tally-critical"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </main>
  )
}

function ArticleForm({ rooms, initialSlug, onDone, onCancel }) {
  const [form, setForm] = useState(EMPTY_ARTICLE)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!initialSlug) return
    fetch(`/api/articles/${initialSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.article) {
          setForm({
            ...d.article,
            location: d.article.location || '',
            tags: (d.article.tags || []).join(', '),
            equipment: (d.article.equipment || []).join(', '),
          })
        }
      })
  }, [initialSlug])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1]
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64 }),
      })
      const data = await res.json()
      setUploading(false)
      if (res.ok) {
        setForm((f) => ({
          ...f,
          content: `${f.content}\n\n![${file.name}](${data.url})\n`,
        }))
      } else {
        alert(data.error || 'Gagal upload gambar.')
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = initialSlug ? `/api/articles/${initialSlug}` : '/api/articles'
    const method = initialSlug ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, location: form.location || null }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Gagal menyimpan.')
      return
    }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
          Judul
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          placeholder='Contoh: "ATEM Mini freeze saat ganti scene"'
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Kategori (jenis alat/masalah)
          </label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Wilayah / Ruangan (opsional)
          </label>
          <select
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          >
            <option value="">— Umum, tidak spesifik ruangan/wilayah —</option>
            {WILAYAH.map((wil) => {
              const wilRooms = rooms.filter((r) => r.wilayah === wil.slug)
              return (
                <optgroup key={wil.slug} label={wil.label}>
                  <option value={wil.slug}>{wil.label} (Umum)</option>
                  {wilRooms.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {wil.label} - {r.name}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
          Deskripsi singkat
        </label>
        <input
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          placeholder="Muncul di kartu artikel & hasil pencarian"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Alat terkait (pisahkan koma)
          </label>
          <input
            value={form.equipment}
            onChange={(e) => update('equipment', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
            placeholder="ATEM Mini Pro, BMD Videohub"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Tag (pisahkan koma)
          </label>
          <input
            value={form.tags}
            onChange={(e) => update('tags', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
            placeholder="freeze, hdmi, genlock"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark">
            Isi artikel (Markdown)
          </label>
          <label className="flex items-center gap-1.5 text-xs text-accent cursor-pointer hover:opacity-80">
            {uploading ? <Loader2 className="animate-spin" size={13} /> : <Upload size={13} />}
            Upload gambar
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <MarkdownToolbar textareaRef={textareaRef} value={form.content} onChange={(v) => update('content', v)} />
        <textarea
          required
          ref={textareaRef}
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          rows={12}
          className="w-full rounded-b-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-mono outline-none"
          placeholder={
            '## Gejala\nJelaskan gejala yang terlihat...\n\n## Penyebab\n...\n\n## Langkah Perbaikan\n1. ...\n2. ...'
          }
        />
      </div>

      {error && <p className="text-sm text-tally-critical">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-accent text-white text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={14} />}
          {initialSlug ? 'Simpan Perubahan' : 'Publish Artikel'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
        >
          Batal
        </button>
      </div>
      <p className="text-xs text-muted-light dark:text-muted-dark">
        Publish akan langsung commit ke GitHub &amp; Vercel otomatis deploy ulang
        (biasanya 30–60 detik).
      </p>
    </form>
  )
}

function equipmentTextToArray(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, notes] = line.split('|').map((s) => s.trim())
      return { name, notes: notes || '' }
    })
}

function equipmentArrayToText(arr) {
  return (arr || []).map((eq) => (eq.notes ? `${eq.name} | ${eq.notes}` : eq.name)).join('\n')
}

function RoomForm({ initialSlug, onDone, onCancel }) {
  const [form, setForm] = useState(EMPTY_ROOM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!initialSlug) {
      setForm(EMPTY_ROOM)
      return
    }
    fetch(`/api/rooms/${initialSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.room) {
          setForm({
            name: d.room.name,
            wilayah: d.room.wilayah || '',
            summary: d.room.summary,
            equipmentText: equipmentArrayToText(d.room.equipment),
            content: d.room.content,
          })
        }
      })
  }, [initialSlug])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const url = initialSlug ? `/api/rooms/${initialSlug}` : '/api/rooms'
    const method = initialSlug ? 'PUT' : 'POST'
    
    // We send payload to backend
    const payload = {
      name: form.name,
      wilayah: form.wilayah,
      summary: form.summary,
      equipment: equipmentTextToArray(form.equipmentText),
      content: form.content,
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Gagal menyimpan.')
      return
    }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Wilayah
          </label>
          <select
            required
            disabled={!!initialSlug}
            value={form.wilayah}
            onChange={(e) => update('wilayah', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none disabled:opacity-60"
          >
            <option value="">— Pilih Wilayah —</option>
            {WILAYAH.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
            Nama Ruangan
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
            placeholder="Contoh: EK 1, EK 2, Chappel"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
          Ringkasan singkat
        </label>
        <input
          value={form.summary}
          onChange={(e) => update('summary', e.target.value)}
          className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          placeholder="Ringkasan singkat tentang ruangan"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
          Daftar alat — satu baris per alat, format: <code>Nama Alat | catatan</code> (catatan opsional)
        </label>
        <textarea
          value={form.equipmentText}
          onChange={(e) => update('equipmentText', e.target.value)}
          rows={5}
          className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-mono outline-none"
          placeholder={'ATEM Constellation 4K | Switcher utama\nvMix Workstation | Backup switcher'}
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
          Tutorial / SOP ruangan (Markdown)
        </label>
        <MarkdownToolbar textareaRef={textareaRef} value={form.content} onChange={(v) => update('content', v)} />
        <textarea
          ref={textareaRef}
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          rows={12}
          className="w-full rounded-b-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-mono outline-none"
          placeholder={'## SOP Buka Ruangan\n1. ...\n\n## SOP Tutup Ruangan\n1. ...'}
        />
      </div>

      {error && <p className="text-sm text-tally-critical">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-accent text-white text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={14} />}
          {initialSlug ? 'Simpan Perubahan' : 'Publish Ruangan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
