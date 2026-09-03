'use client'

import { useEffect, useState, useRef } from 'react'
import { CATEGORIES } from '@/lib/categories'
import { WILAYAH } from '@/lib/locations'
import {
  Loader2,
  Upload,
  Trash2,
  Pencil,
  Plus,
  LogOut,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
} from 'lucide-react'

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
    function checkAuth() {
      fetch('/api/auth')
        .then((r) => r.json())
        .then((d) => setAuthed(!!d.authed))
        .catch(() => setAuthed(false))
        .finally(() => setChecking(false))
    }

    checkAuth()

    // Cek session secara berkala (tiap 1 menit) & saat tab kembali aktif
    const interval = setInterval(checkAuth, 60 * 1000)
    window.addEventListener('focus', checkAuth)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', checkAuth)
    }
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


function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function insertImageAtCursor(textareaRef, content, setContent, url, alt = '') {
  const textarea = textareaRef?.current
  const altText = alt.trim() || 'Gambar'
  const imageMarkdown = `![${altText}](${url})`

  if (!textarea) {
    const newContent = content ? `${content}\n\n${imageMarkdown}\n` : `${imageMarkdown}\n`
    setContent(newContent)
    return
  }

  const start = textarea.selectionStart ?? textarea.value.length
  const end = textarea.selectionEnd ?? textarea.value.length
  const text = textarea.value

  const before = text.substring(0, start)
  const after = text.substring(end)

  const needsLeadingNewline = before.length > 0 && !before.endsWith('\n\n')
  const leading = needsLeadingNewline ? (before.endsWith('\n') ? '\n' : '\n\n') : ''
  const needsTrailingNewline = after.length > 0 && !after.startsWith('\n\n')
  const trailing = needsTrailingNewline ? (after.startsWith('\n') ? '\n' : '\n\n') : '\n'

  const insertedText = `${leading}${imageMarkdown}${trailing}`
  const newContent = before + insertedText + after
  setContent(newContent)

  setTimeout(() => {
    textarea.focus()
    const newCursorPos = start + insertedText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 40)
}

function ImageModal({ isOpen, onClose, onInsert }) {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'url' | 'library'

  // Upload state
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadAlt, setUploadAlt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  // URL state
  const [inputUrl, setInputUrl] = useState('')
  const [urlAlt, setUrlAlt] = useState('')
  const [urlError, setUrlError] = useState('')
  const [urlImgError, setUrlImgError] = useState(false)

  // Library state
  const [libraryFiles, setLibraryFiles] = useState([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const [selectedLibraryUrl, setSelectedLibraryUrl] = useState('')
  const [libraryAlt, setLibraryAlt] = useState('')

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      loadLibrary()
    }
  }, [isOpen, activeTab])

  function loadLibrary() {
    setLoadingLibrary(true)
    fetch('/api/upload')
      .then((r) => r.json())
      .then((d) => {
        setLibraryFiles(d.files || [])
      })
      .catch(() => setLibraryFiles([]))
      .finally(() => setLoadingLibrary(false))
  }

  function handleFileSelection(selectedFile) {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      setUploadError('Hanya file gambar yang diperbolehkan (PNG, JPG, WEBP, GIF, dll).')
      return
    }
    setUploadError('')
    setFile(selectedFile)
    const blobUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(blobUrl)
    if (!uploadAlt) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setUploadAlt(cleanName)
    }
  }

  async function handleUploadSubmit(e) {
    e.preventDefault()
    if (!file) {
      setUploadError('Pilih file gambar terlebih dahulu.')
      return
    }
    setUploading(true)
    setUploadError('')

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(',')[1]
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64 }),
        })
        const data = await res.json()
        setUploading(false)
        if (res.ok) {
          onInsert(data.url, uploadAlt || file.name.replace(/\.[^/.]+$/, ''))
          handleClose()
        } else {
          setUploadError(data.error || 'Gagal mengunggah gambar.')
        }
      } catch (err) {
        setUploading(false)
        setUploadError(err.message || 'Terjadi kesalahan saat upload.')
      }
    }
    reader.onerror = () => {
      setUploading(false)
      setUploadError('Gagal membaca file dari komputer.')
    }
    reader.readAsDataURL(file)
  }

  function handleUrlSubmit(e) {
    e.preventDefault()
    if (!inputUrl.trim()) {
      setUrlError('URL gambar wajib diisi.')
      return
    }
    onInsert(inputUrl.trim(), urlAlt.trim() || 'Gambar')
    handleClose()
  }

  function handleLibrarySubmit(e) {
    e.preventDefault()
    if (!selectedLibraryUrl) return
    onInsert(selectedLibraryUrl, libraryAlt.trim() || 'Gambar')
    handleClose()
  }

  function handleClose() {
    setFile(null)
    setPreviewUrl('')
    setUploadAlt('')
    setUploadError('')
    setInputUrl('')
    setUrlAlt('')
    setUrlError('')
    setUrlImgError(false)
    setSelectedLibraryUrl('')
    setLibraryAlt('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
          <div>
            <h2 className="font-display font-semibold text-base">Sematkan Gambar</h2>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Tambahkan gambar ke dalam panduan tutorial
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup"
            className="p-1 rounded-sm text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark hover:bg-bg-light dark:hover:bg-bg-dark"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border-light dark:border-border-dark bg-bg-light/60 dark:bg-bg-dark/60 px-4 pt-2 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
            }`}
          >
            <Upload size={13} />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'url'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
            }`}
          >
            <LinkIcon size={13} />
            Tautan / URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'library'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
            }`}
          >
            <ImageIcon size={13} />
            Pustaka Media
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelection(e.target.files?.[0])}
              />

              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleFileSelection(e.dataTransfer.files?.[0])
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-light dark:border-border-dark rounded-md p-6 text-center cursor-pointer hover:border-accent/80 hover:bg-bg-light/40 dark:hover:bg-bg-dark/40 transition-colors"
                >
                  <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
                    <Upload size={18} />
                  </div>
                  <p className="text-sm font-medium">Klik untuk pilih gambar atau tarik ke sini</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                    Mendukung PNG, JPG, JPEG, WEBP, GIF
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-md border border-border-light dark:border-border-dark overflow-hidden bg-bg-light dark:bg-bg-dark p-2 flex items-center gap-3">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border border-border-light dark:border-border-dark shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-muted-light dark:text-muted-dark">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-accent hover:underline shrink-0 px-2 py-1"
                    >
                      Ganti
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                  Keterangan Gambar / Teks Alternatif (Alt)
                </label>
                <input
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Contoh: Skema perkabelan ATEM switcher"
                  className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none"
                />
                <p className="text-[11px] text-muted-light dark:text-muted-dark mt-1">
                  Membantu pembaca memahami konteks gambar.
                </p>
              </div>

              {uploadError && <p className="text-xs text-tally-critical">{uploadError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="rounded-sm bg-accent text-white text-xs font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={13} />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Upload &amp; Sematkan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                  URL / Tautan Gambar
                </label>
                <input
                  required
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value)
                    setUrlError('')
                    setUrlImgError(false)
                  }}
                  placeholder="https://contoh.com/gambar.jpg atau /uploads/gambar.jpg"
                  className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none font-mono"
                />
              </div>

              {inputUrl.trim() && (
                <div className="rounded-md border border-border-light dark:border-border-dark p-2 bg-bg-light dark:bg-bg-dark text-center">
                  <p className="text-[11px] text-muted-light dark:text-muted-dark mb-2 text-left font-mono">
                    Pratinjau:
                  </p>
                  <img
                    src={inputUrl.trim()}
                    alt="Pratinjau URL"
                    onError={() => setUrlImgError(true)}
                    className="max-h-48 mx-auto rounded border border-border-light dark:border-border-dark object-contain"
                  />
                  {urlImgError && (
                    <p className="text-xs text-tally-critical mt-1">
                      Peringatan: Gambar tidak dapat dimuat dari URL tersebut. Pastikan URL dapat diakses publik.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                  Keterangan Gambar / Teks Alternatif (Alt)
                </label>
                <input
                  value={urlAlt}
                  onChange={(e) => setUrlAlt(e.target.value)}
                  placeholder="Contoh: Diagram koneksi video switcher"
                  className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none"
                />
              </div>

              {urlError && <p className="text-xs text-tally-critical">{urlError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!inputUrl.trim()}
                  className="rounded-sm bg-accent text-white text-xs font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check size={13} />
                  Sematkan Gambar
                </button>
              </div>
            </form>
          )}

          {activeTab === 'library' && (
            <form onSubmit={handleLibrarySubmit} className="space-y-4">
              {loadingLibrary ? (
                <div className="py-12 flex justify-center items-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                  <Loader2 className="animate-spin" size={16} /> Memuat gambar tersimpan...
                </div>
              ) : libraryFiles.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-light dark:text-muted-dark">
                  <p>Belum ada gambar yang tersimpan di server.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="mt-2 text-accent underline hover:opacity-80"
                  >
                    Unggah gambar baru sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    Pilih gambar yang pernah diunggah sebelumnya:
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {libraryFiles.map((item) => {
                      const isSelected = selectedLibraryUrl === item.url
                      return (
                        <div
                          key={item.url}
                          onClick={() => {
                            setSelectedLibraryUrl(item.url)
                            if (!libraryAlt) {
                              setLibraryAlt(item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
                            }
                          }}
                          className={`group relative rounded border cursor-pointer overflow-hidden p-1 transition-all ${
                            isSelected
                              ? 'border-accent ring-2 ring-accent/30 bg-accent/5'
                              : 'border-border-light dark:border-border-dark hover:border-accent/60'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <p className="text-[10px] truncate mt-1 text-muted-light dark:text-muted-dark">
                            {item.name}
                          </p>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-accent text-white p-0.5 rounded-full">
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedLibraryUrl && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                    Keterangan Gambar / Teks Alternatif (Alt)
                  </label>
                  <input
                    value={libraryAlt}
                    onChange={(e) => setLibraryAlt(e.target.value)}
                    placeholder="Contoh: Gambar alat switcher"
                    className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedLibraryUrl}
                  className="rounded-sm bg-accent text-white text-xs font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check size={13} />
                  Sematkan Gambar Terpilih
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function MarkdownToolbar({ textareaRef, value, onChange, onOpenImageModal }) {
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
      <button
        type="button"
        title="Sematkan Gambar (Upload / URL / Pustaka)"
        onClick={onOpenImageModal}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs text-accent font-medium border border-border-light dark:border-border-dark flex items-center gap-1"
      >
        <ImageIcon size={12} />
        Gambar
      </button>
      <button
        type="button"
        title="Embed YouTube Video"
        onClick={() => insertFormatting('<YouTube url="', '" />')}
        className="px-2 py-1 rounded hover:bg-surface-light dark:hover:bg-surface-dark text-xs text-red-500 font-medium border border-border-light dark:border-border-dark"
      >
        ▶ YouTube
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
  const [showImageModal, setShowImageModal] = useState(false)
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
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="flex items-center gap-1.5 text-xs text-accent hover:opacity-80 font-medium"
          >
            <ImageIcon size={13} />
            Sematkan gambar
          </button>
        </div>
        <MarkdownToolbar
          textareaRef={textareaRef}
          value={form.content}
          onChange={(v) => update('content', v)}
          onOpenImageModal={() => setShowImageModal(true)}
        />
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
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onInsert={(url, alt) =>
            insertImageAtCursor(
              textareaRef,
              form.content,
              (v) => update('content', v),
              url,
              alt
            )
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
  const [showImageModal, setShowImageModal] = useState(false)
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
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark">
            Tutorial / SOP ruangan (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="flex items-center gap-1.5 text-xs text-accent hover:opacity-80 font-medium"
          >
            <ImageIcon size={13} />
            Sematkan gambar
          </button>
        </div>
        <MarkdownToolbar
          textareaRef={textareaRef}
          value={form.content}
          onChange={(v) => update('content', v)}
          onOpenImageModal={() => setShowImageModal(true)}
        />
        <textarea
          ref={textareaRef}
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          rows={12}
          className="w-full rounded-b-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-mono outline-none"
          placeholder={'## SOP Buka Ruangan\n1. ...\n\n## SOP Tutup Ruangan\n1. ...'}
        />
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onInsert={(url, alt) =>
            insertImageAtCursor(
              textareaRef,
              form.content,
              (v) => update('content', v),
              url,
              alt
            )
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
