'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Loader2,
  Calendar,
  Clock,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Copy,
  Check,
  Radio,
  CheckCircle2,
  ListPlus,
  Key,
  MessageSquare,
  Tag,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

export default function CreateStreamModal({ isOpen, onClose, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [options, setOptions] = useState({ streams: [], playlists: [], categories: [] })
  const [error, setError] = useState('')
  const [createdResult, setCreatedResult] = useState(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [showKey, setShowKey] = useState(false)

  // Default waktu: 1 jam dari sekarang, dibulatkan ke kelipatan 15 menit
  const getInitialTime = () => {
    const d = new Date()
    d.setHours(d.getHours() + 1)
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduledStartTime: getInitialTime(),
    privacyStatus: 'unlisted', // unlisted, public, private
    latencyPreference: 'normal', // normal, low, ultraLow
    enableAutoStart: false,
    enableAutoStop: false,
    enableDvr: true,
    // Fitur baru
    streamKeyChoice: 'existing', // 'existing' | 'new'
    selectedStreamId: '',
    playlistId: '',
    categoryId: '29', // Default Nonprofits & Activism (Gereja / Rohani)
    enableLiveChat: true,
  })

  // Load stream keys, playlists, and categories
  useEffect(() => {
    if (!isOpen) return

    setLoadingOptions(true)
    fetch('/api/youtube/options')
      .then((r) => r.json())
      .then((data) => {
        if (data.streams || data.playlists || data.categories) {
          setOptions({
            streams: data.streams || [],
            playlists: data.playlists || [],
            categories: data.categories || [],
          })
          // Set default selected stream ID jika ada
          if (data.streams && data.streams.length > 0) {
            setForm((prev) => ({
              ...prev,
              selectedStreamId: prev.selectedStreamId || data.streams[0].id,
            }))
          }
        }
      })
      .catch((err) => console.warn('Gagal memuat options:', err))
      .finally(() => setLoadingOptions(false))
  }, [isOpen])

  if (!isOpen) return null

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title: form.title,
      description: form.description,
      scheduledStartTime: form.scheduledStartTime,
      privacyStatus: form.privacyStatus,
      latencyPreference: form.latencyPreference,
      enableAutoStart: form.enableAutoStart,
      enableAutoStop: form.enableAutoStop,
      enableDvr: form.enableDvr,
      streamId: form.streamKeyChoice === 'existing' ? form.selectedStreamId : null,
      playlistId: form.playlistId || null,
      categoryId: form.categoryId || null,
    }

    try {
      const res = await fetch('/api/youtube/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.error || 'Gagal membuat upcoming live stream.')
        return
      }

      setCreatedResult({
        ...data.stream,
        enableLiveChat: form.enableLiveChat,
      })
      if (onCreated) onCreated()
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Terjadi kesalahan saat membuat siaran.')
    }
  }

  function handleCopy(text, type) {
    navigator.clipboard.writeText(text)
    if (type === 'url') {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  function handleResetAndClose() {
    setCreatedResult(null)
    setForm({
      title: '',
      description: '',
      scheduledStartTime: getInitialTime(),
      privacyStatus: 'unlisted',
      latencyPreference: 'normal',
      enableAutoStart: false,
      enableAutoStop: false,
      enableDvr: true,
      streamKeyChoice: 'existing',
      selectedStreamId: options.streams[0]?.id || '',
      playlistId: '',
      categoryId: '29',
      enableLiveChat: true,
    })
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-2xl my-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50">
          <div className="flex items-center gap-2">
            <Radio className="text-red-500 animate-pulse" size={18} />
            <h2 className="font-display font-semibold text-base">
              {createdResult ? 'Stream Berhasil Dijadwalkan' : 'Buat Upcoming Live Stream'}
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {createdResult ? (
            /* Success State with RTMP Details */
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold">Siaran YouTube Berhasil Dijadwalkan!</h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Judul: <strong>{createdResult.title}</strong>
                  </p>
                  <p className="text-xs opacity-75 mt-0.5">
                    ID Siaran: <code className="font-mono">{createdResult.broadcastId}</code>
                  </p>
                </div>
              </div>

              {/* Notice jika user memilih Live Chat Nonaktif */}
              {!createdResult.enableLiveChat && (
                <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <MessageSquare size={14} />
                    <span>Catatan Penonaktifan Live Chat:</span>
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    Sesuai kebijakan YouTube Data API, switch penonaktifan live chat harus dikonfirmasi melalui YouTube Studio Live Control Room.
                  </p>
                  <a
                    href={`https://studio.youtube.com/video/${createdResult.broadcastId}/livestreaming`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold underline mt-1 text-amber-900 dark:text-amber-200"
                  >
                    <span>Buka YouTube Studio untuk Mematikan Chat</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* RTMP Credentials */}
              <div className="space-y-4 p-4 rounded-md border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-light dark:text-muted-dark flex items-center gap-1.5">
                  <Key size={13} />
                  Informasi Ingest Switcher / Encoder
                </h4>

                <div>
                  <label className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1">
                    URL Server RTMP
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={createdResult.rtmpUrl}
                      className="flex-1 rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs font-mono select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(createdResult.rtmpUrl, 'url')}
                      className="px-3 py-2 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs flex items-center gap-1.5 shrink-0"
                    >
                      {copiedUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1">
                    Stream Key (Kunci Streaming)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      type={showKey ? 'text' : 'password'}
                      value={createdResult.streamKey}
                      className="flex-1 rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs font-mono select-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark"
                      title={showKey ? 'Sembunyikan Key' : 'Lihat Key'}
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(createdResult.streamKey, 'key')}
                      className="px-3 py-2 rounded-sm bg-accent text-white hover:opacity-90 text-xs flex items-center gap-1.5 shrink-0"
                    >
                      {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedKey ? 'Tersalin' : 'Salin Key'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-light dark:text-muted-dark mt-1.5">
                    {form.streamKeyChoice === 'existing'
                      ? 'Stream Key ini adalah key tetap (reusable) yang sudah tersimpan di switcher/encoder Anda.'
                      : 'Salin Stream Key ini ke switcher vMix, ATEM Software Control, atau OBS di ruang gereja.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-sm bg-accent text-white text-sm font-medium hover:opacity-90"
                >
                  Selesai &amp; Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form Create Broadcast */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Judul & Deskripsi */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                  Judul Siaran <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="Contoh: Ibadah Raya Minggu - GMS Surabaya (Sesi 1)"
                  className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                  Deskripsi Siaran
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={2}
                  placeholder="Deskripsi ibadah, tema khotbah, link warta jemaat..."
                  className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              {/* 2. Jadwal & Privasi */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                    Jadwal Mulai Siaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.scheduledStartTime}
                    onChange={(e) => update('scheduledStartTime', e.target.value)}
                    className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                    Privasi
                  </label>
                  <select
                    value={form.privacyStatus}
                    onChange={(e) => update('privacyStatus', e.target.value)}
                    className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="unlisted">Unlisted (Tidak Terdaftar - Hanya via Link)</option>
                    <option value="public">Public (Publik - Terbuka untuk Semua)</option>
                    <option value="private">Private (Pribadi - Hanya Tim)</option>
                  </select>
                </div>
              </div>

              {/* 3. Pilihan Stream Key (Reusable vs Baru) */}
              <div className="p-4 rounded-md border border-border-light dark:border-border-dark bg-bg-light/40 dark:bg-bg-dark/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wide font-semibold text-muted-light dark:text-muted-dark flex items-center gap-1.5">
                    <Key size={13} />
                    Pilihan Stream Key (Kunci Streaming)
                  </label>
                  {loadingOptions && (
                    <span className="text-[11px] text-muted-light dark:text-muted-dark flex items-center gap-1">
                      <Loader2 size={11} className="animate-spin text-accent" /> Memuat stream keys...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => update('streamKeyChoice', 'existing')}
                    className={`p-2.5 rounded-sm border text-left transition-all ${
                      form.streamKeyChoice === 'existing'
                        ? 'border-accent bg-accent/5 dark:bg-accent/10 text-accent font-medium shadow-sm'
                        : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                    }`}
                  >
                    <p className="text-xs font-semibold">Gunakan Key yang Sudah Ada</p>
                    <p className="text-[10px] opacity-80 mt-0.5 leading-tight">
                      Kunci tetap (reusable), tidak perlu ganti di ATEM/vMix tiap minggu
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => update('streamKeyChoice', 'new')}
                    className={`p-2.5 rounded-sm border text-left transition-all ${
                      form.streamKeyChoice === 'new'
                        ? 'border-accent bg-accent/5 dark:bg-accent/10 text-accent font-medium shadow-sm'
                        : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                    }`}
                  >
                    <p className="text-xs font-semibold">Buat Key Baru Sekali Pakai</p>
                    <p className="text-[10px] opacity-80 mt-0.5 leading-tight">
                      Membuat stream key baru khusus untuk jadwal ini
                    </p>
                  </button>
                </div>

                {form.streamKeyChoice === 'existing' && (
                  <div className="pt-1">
                    <label className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1">
                      Pilih Stream Key Tersedia di Channel:
                    </label>
                    {options.streams.length === 0 ? (
                      <div className="text-xs text-amber-600 dark:text-amber-400 p-2 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                        {loadingOptions
                          ? 'Sedang membaca stream keys...'
                          : 'Tidak ada stream key lama yang ditemukan. Sistem akan otomatis membuatkan key baru.'}
                      </div>
                    ) : (
                      <select
                        value={form.selectedStreamId}
                        onChange={(e) => update('selectedStreamId', e.target.value)}
                        className="w-full rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs outline-none focus:border-accent font-mono"
                      >
                        {options.streams.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.streamKey ? `${s.streamKey.slice(0, 4)}...${s.streamKey.slice(-4)}` : s.id})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Playlist & Kategori Video */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                    <ListPlus size={13} />
                    Masukkan ke Playlist (Opsional)
                  </label>
                  <select
                    value={form.playlistId}
                    onChange={(e) => update('playlistId', e.target.value)}
                    className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    <option value="">— Tidak dimasukkan ke playlist —</option>
                    {options.playlists.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.itemCount} video)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark mb-1">
                    <Tag size={13} />
                    Kategori Siaran
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => update('categoryId', e.target.value)}
                    className="w-full rounded-sm border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    {options.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Live Chat & Latency Settings */}
              <div className="p-4 rounded-md border border-border-light dark:border-border-dark bg-bg-light/40 dark:bg-bg-dark/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-light dark:text-muted-dark flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    Live Chat &amp; Latensi Studio
                  </h4>
                </div>

                {/* Live Chat Option */}
                <div className="flex items-center justify-between p-2.5 rounded-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold">Live Chat Siaran</span>
                    <p className="text-[11px] text-muted-light dark:text-muted-dark">
                      {form.enableLiveChat
                        ? 'Live Chat diaktifkan bagi penonton siaran langsung.'
                        : 'Live Chat akan ditutup (memerlukan konfirmasi cepat di Studio).'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update('enableLiveChat', true)}
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        form.enableLiveChat
                          ? 'bg-accent text-white'
                          : 'border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                      }`}
                    >
                      Aktif
                    </button>
                    <button
                      type="button"
                      onClick={() => update('enableLiveChat', false)}
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        !form.enableLiveChat
                          ? 'bg-zinc-700 text-white'
                          : 'border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                      }`}
                    >
                      Nonaktif
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1">
                    Mode Latensi Siaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'normal', label: 'Normal Latency', desc: 'Delay ~15-20s (Kualitas HD)' },
                      { value: 'low', label: 'Low Latency', desc: 'Delay ~5-7s (Interaksi cepat)' },
                      { value: 'ultraLow', label: 'Ultra Low', desc: 'Delay ~2s (Realtime)' },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => update('latencyPreference', opt.value)}
                        className={`p-2 rounded-sm border text-left transition-all ${
                          form.latencyPreference === opt.value
                            ? 'border-accent bg-accent/5 dark:bg-accent/10 text-accent font-medium'
                            : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                        }`}
                      >
                        <p className="text-xs font-semibold">{opt.label}</p>
                        <p className="text-[10px] opacity-80 mt-0.5 leading-tight">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-start & DVR */}
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableAutoStart}
                      onChange={(e) => update('enableAutoStart', e.target.checked)}
                      className="rounded mt-0.5 text-accent"
                    />
                    <div className="text-xs">
                      <span className="font-medium">Auto-start</span>
                      <p className="text-[10px] text-muted-light dark:text-muted-dark">
                        Langsung Live saat encoder online.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableAutoStop}
                      onChange={(e) => update('enableAutoStop', e.target.checked)}
                      className="rounded mt-0.5 text-accent"
                    />
                    <div className="text-xs">
                      <span className="font-medium">Auto-stop</span>
                      <p className="text-[10px] text-muted-light dark:text-muted-dark">
                        Otomatis stop saat encoder offline.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableDvr}
                      onChange={(e) => update('enableDvr', e.target.checked)}
                      className="rounded mt-0.5 text-accent"
                    />
                    <div className="text-xs">
                      <span className="font-medium">Enable DVR</span>
                      <p className="text-[10px] text-muted-light dark:text-muted-dark">
                        Penonton bisa rewind siaran.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-sm bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {loading && <Loader2 className="animate-spin" size={15} />}
                  Buat Siaran YouTube
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
