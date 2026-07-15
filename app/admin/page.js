'use client'

import { useEffect, useState } from 'react'
import { CATEGORIES, WILAYAH } from '@/lib/categories'
import { Loader2, Upload, Trash2, Pencil, Plus, LogOut, Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Video } from 'lucide-react'

const EMPTY_FORM = {
  title: '',
  category: CATEGORIES[0].slug,
  wilayah: '',
  description: '',
  tags: '',
  equipment: '',
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
        {error && <p className="text-sm text-red-500">{error}</p>}
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

function AdminDashboard({ onLogout }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function refresh() {
    setLoading(true)
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  async function handleDelete(slug) {
    if (!confirm(`Hapus artikel "${slug}"? Tindakan ini akan commit ke GitHub.`)) return
    const res = await fetch(`/api/articles/${slug}`, { method: 'DELETE' })
    if (res.ok) refresh()
    else alert('Gagal menghapus artikel.')
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    onLogout()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Panel Admin</h1>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            Kelola artikel dokumentasi. Publish akan commit ke GitHub &amp; auto-deploy.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted-light dark:text-muted-dark hover:text-accent"
        >
          <LogOut size={14} /> Keluar
        </button>
      </div>

      {showForm ? (
        <ArticleForm
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
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 inline-flex items-center gap-1.5 rounded-sm bg-accent text-white text-sm font-medium px-3 py-2 hover:opacity-90"
          >
            <Plus size={15} /> Artikel Baru
          </button>

          {loading ? (
            <Loader2 className="animate-spin text-muted-light dark:text-muted-dark" size={18} />
          ) : (
            <div className="rounded-md border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
              {articles.length === 0 && (
                <p className="p-6 text-sm text-muted-light dark:text-muted-dark">
                  Belum ada artikel.
                </p>
              )}
              {articles.map((a) => (
                <div key={a.slug} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.title}</p>
                      <p className="text-xs text-muted-light dark:text-muted-dark font-mono">
                        {a.category}{a.wilayah ? ` · ${a.wilayah}` : ''} · {a.slug}
                      </p>
                    </div>
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
                      onClick={() => handleDelete(a.slug)}
                      aria-label="Hapus"
                      className="text-muted-light dark:text-muted-dark hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

function ArticleForm({ initialSlug, onDone, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFormat = (before, after = '') => {
    const textarea = document.getElementById('content-textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.content
    const selectedText = text.substring(start, end)
    const replacement = before + selectedText + after

    const newContent = text.substring(0, start) + replacement + text.substring(end)
    setForm((f) => ({ ...f, content: newContent }))

    // Focus back and set selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  function handleAddVideo() {
    const url = prompt('Masukkan URL video YouTube atau Vimeo:')
    if (!url) return

    // Parse YouTube
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=)([^#\\&\\?]*).*/
    const ytMatch = url.match(ytReg)
    const ytId = ytMatch && ytMatch[2].length === 11 ? ytMatch[2] : null

    if (ytId) {
      handleFormat(`\n\n<Youtube id="${ytId}" />\n`)
      return
    }

    // Parse Vimeo
    const vimReg = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
    const vimMatch = url.match(vimReg)
    const vimId = vimMatch ? vimMatch[1] : null

    if (vimId) {
      handleFormat(`\n\n<Vimeo id="${vimId}" />\n`)
      return
    }

    alert('URL tidak dikenali. Pastikan memasukkan URL YouTube atau Vimeo yang valid.')
  }

  function handleAddLink() {
    const url = prompt('Masukkan URL Link:')
    if (!url) return
    handleFormat('[', `](${url})`)
  }


  useEffect(() => {
    if (!initialSlug) return
    fetch(`/api/articles/${initialSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.article) {
          setForm({
            ...d.article,
            wilayah: d.article.wilayah || '',
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
      body: JSON.stringify(form),
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
            Kategori
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
            Wilayah
          </label>
          <select
            value={form.wilayah}
            onChange={(e) => update('wilayah', e.target.value)}
            className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none"
          >
            <option value="">— Tidak spesifik —</option>
            {WILAYAH.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.label}
              </option>
            ))}
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark">
            Isi artikel (Markdown)
          </label>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border border-b-0 border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50 px-2 py-1.5 rounded-t-sm">
          <button
            type="button"
            onClick={() => handleFormat('**', '**')}
            title="Tebal (Bold)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('*', '*')}
            title="Miring (Italic)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <Italic size={15} />
          </button>
          <div className="w-[1px] h-4 bg-border-light dark:bg-border-dark mx-1" />
          <button
            type="button"
            onClick={() => handleFormat('## ')}
            title="Judul 2 (Heading 2)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('### ')}
            title="Judul 3 (Heading 3)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <Heading3 size={15} />
          </button>
          <div className="w-[1px] h-4 bg-border-light dark:bg-border-dark mx-1" />
          <button
            type="button"
            onClick={() => handleFormat('- ')}
            title="Daftar Poin (Bullet List)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('1. ')}
            title="Daftar Angka (Numbered List)"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <ListOrdered size={15} />
          </button>
          <div className="w-[1px] h-4 bg-border-light dark:bg-border-dark mx-1" />
          <button
            type="button"
            onClick={handleAddLink}
            title="Sematkan Link"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <LinkIcon size={15} />
          </button>
          <button
            type="button"
            onClick={handleAddVideo}
            title="Sematkan Video YouTube/Vimeo"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors"
          >
            <Video size={15} />
          </button>
          <label
            title="Upload Gambar"
            className="p-1.5 rounded hover:bg-border-light dark:hover:bg-border-dark text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors cursor-pointer flex items-center justify-center"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Upload size={15} />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <textarea
          required
          id="content-textarea"
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          rows={14}
          className="w-full rounded-b-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-mono outline-none"
          placeholder={
            '## Gejala\nJelaskan gejala yang terlihat...\n\n## Penyebab\n...\n\n## Langkah Perbaikan\n1. ...\n2. ...'
          }
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

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
      <p className="text-xs text-muted-light dark:text-muted-dark flex items-center gap-1">
        Publish akan langsung commit ke GitHub &amp; Vercel otomatis deploy ulang
        (biasanya 30–60 detik).
      </p>
    </form>
  )
}
