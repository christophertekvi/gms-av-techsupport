'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Radio,
  Plus,
  RefreshCw,
  Play,
  Square,
  Copy,
  Check,
  ExternalLink,
  Activity,
  AlertCircle,
  Clock,
  Globe,
  Lock,
  Eye,
  LogOut,
  Loader2,
  Tv,
  CheckCircle2,
  MonitorPlay,
  X,
} from 'lucide-react'
import CreateStreamModal from './CreateStreamModal'
import StreamMatrixModal from './StreamMatrixModal'
import LiveEmbedPlayer from './LiveEmbedPlayer'

export default function LiveStreamingTab() {
  const [authStatus, setAuthStatus] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [broadcasts, setBroadcasts] = useState([])
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false)
  const [broadcastError, setBroadcastError] = useState('')
  const [filter, setFilter] = useState('upcoming') // upcoming | live | all | completed

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBroadcast, setSelectedBroadcast] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [copiedKeyId, setCopiedKeyId] = useState(null)
  const [watchingId, setWatchingId] = useState(null) // ID broadcast yang sedang ditonton embed

  // Cek auth status YouTube
  const checkAuth = useCallback(async () => {
    setCheckingAuth(true)
    try {
      const res = await fetch('/api/youtube/auth')
      const data = await res.json()
      setAuthStatus(data)
      if (data.connected) {
        loadBroadcasts()
      }
    } catch (err) {
      console.error('Gagal mengecek status YouTube OAuth:', err)
    } finally {
      setCheckingAuth(false)
    }
  }, [])

  // Load broadcasts
  const loadBroadcasts = async () => {
    setLoadingBroadcasts(true)
    setBroadcastError('')
    try {
      const res = await fetch('/api/youtube/broadcasts')
      const data = await res.json()
      if (res.ok && data.broadcasts) {
        setBroadcasts(data.broadcasts)
      } else {
        setBroadcastError(data.error || 'Gagal memuat siaran live YouTube.')
      }
    } catch (err) {
      setBroadcastError(err.message || 'Terjadi kesalahan saat memuat siaran.')
    } finally {
      setLoadingBroadcasts(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Disconnect Channel
  const handleDisconnect = async () => {
    if (!confirm('Putuskan koneksi channel YouTube ini dari panel admin?')) return
    try {
      await fetch('/api/youtube/auth', { method: 'DELETE' })
      setAuthStatus((prev) => ({ ...prev, connected: false, channel: null }))
      setBroadcasts([])
    } catch (err) {
      alert('Gagal memutuskan koneksi: ' + err.message)
    }
  }

  // Quick Start / Stop
  const handleQuickTransition = async (broadcastId, targetStatus) => {
    const actionText =
      targetStatus === 'live' ? 'Mulai Live Streaming (Go Live)?' : 'Akhiri / Stop Live Streaming ini?'
    if (!confirm(`Konfirmasi: Apakah Anda yakin ingin ${actionText}`)) return

    // Validasi sebelum Go Live: pastikan encoder sudah terhubung dan broadcast di status 'ready'
    if (targetStatus === 'live') {
      const broadcast = broadcasts.find((b) => b.id === broadcastId)
      if (broadcast) {
        const lifecycleStatus = broadcast.lifeCycleStatus
        const encoderConnected = broadcast.stream?.streamStatus === 'active'

        if (!encoderConnected) {
          alert(
            '❌ Go Live Gagal: Encoder Belum Terhubung\n\n' +
            'YouTube menolak transisi karena encoder (switcher/OBS) belum mengirim stream ke YouTube.\n\n' +
            'Langkah yang perlu dilakukan:\n' +
            '1. Pastikan switcher (ATEM, vMix, atau OBS) sudah menyala\n' +
            '2. Masukkan Stream Key yang benar ke software encoder\n' +
            '3. Mulai output stream dari encoder\n' +
            '4. Tunggu status Encoder berubah menjadi "Terhubung" (hijau)\n' +
            '5. Coba Go Live kembali'
          )
          return
        }

        if (lifecycleStatus === 'created') {
          alert(
            '⚠️ Go Live Gagal: Siaran Belum Siap\n\n' +
            `Status broadcast saat ini: "${lifecycleStatus}" (belum ready).\n\n` +
            'YouTube memerlukan siaran dalam status "ready" sebelum bisa Go Live.\n' +
            'Encoder sudah terdeteksi terhubung — tunggu beberapa detik lalu klik Refresh dan coba lagi.'
          )
          return
        }
      }
    }

    setActionLoadingId(broadcastId)
    try {
      const res = await fetch(`/api/youtube/broadcasts/${broadcastId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      })
      const data = await res.json()
      setActionLoadingId(null)
      if (!res.ok) {
        // Terjemahkan error YouTube API ke pesan yang lebih mudah dipahami
        const rawError = data.error || ''
        let friendlyError = rawError
        if (rawError.toLowerCase().includes('invalidtransition') || rawError.toLowerCase().includes('invalid transition')) {
          friendlyError =
            '❌ Invalid Transition\n\n' +
            'YouTube menolak perpindahan status siaran ini. Kemungkinan penyebab:\n' +
            '• Encoder belum mengirim video stream ke YouTube\n' +
            '• Broadcast belum dalam status "ready" (coba Refresh dulu)\n' +
            '• Stream Key yang digunakan tidak cocok dengan siaran ini\n\n' +
            'Klik Refresh untuk memperbarui status, lalu coba lagi setelah encoder terhubung.'
        }
        alert(friendlyError)
        return
      }
      loadBroadcasts()
    } catch (err) {
      setActionLoadingId(null)
      alert(err.message || 'Terjadi kesalahan sistem saat mengubah status.')
    }
  }

  const handleCopyKey = (key, id) => {
    if (!key) return
    navigator.clipboard.writeText(key)
    setCopiedKeyId(id)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  // Filter broadcasts
  const filteredBroadcasts = broadcasts.filter((b) => {
    const status = b.lifeCycleStatus
    if (filter === 'upcoming') return status === 'created' || status === 'ready'
    if (filter === 'live') return status === 'live' || status === 'testing'
    if (filter === 'completed') return status === 'complete'
    return true
  })

  // Format tanggal Indonesia
  const formatDate = (isoStr) => {
    if (!isoStr) return '-'
    const d = new Date(isoStr)
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  }

  if (checkingAuth) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-light dark:text-muted-dark">
        <Loader2 className="animate-spin text-accent" size={24} />
        <p className="text-sm">Menghubungkan ke layanan YouTube API...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Channel Connection Banner */}
      {!authStatus?.isConfigured ? (
        <div className="p-6 rounded-lg border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-3">
          <div className="flex items-start gap-3 text-amber-600 dark:text-amber-400">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Konfigurasi YouTube OAuth Diperlukan</h3>
              <p className="text-xs mt-1 text-muted-light dark:text-muted-dark leading-relaxed">
                Untuk mengaktifkan manajemen YouTube Live Streaming dan YouTube Studio Matrix, tambahkan credentials Google OAuth 2.0 ke file <code>.env.local</code> Anda:
              </p>
              <div className="mt-3 p-3 rounded bg-black/5 dark:bg-black/40 font-mono text-xs text-ink-light dark:text-ink-dark space-y-1">
                <p>YOUTUBE_CLIENT_ID=your-google-oauth-client-id</p>
                <p>YOUTUBE_CLIENT_SECRET=your-google-oauth-client-secret</p>
              </div>
              <p className="text-[11px] text-muted-light dark:text-muted-dark mt-2">
                Pastikan Authorized Redirect URI di Google Cloud Console diisi: <code>http://localhost:3000/api/youtube/callback</code> (atau domain live).
              </p>
            </div>
          </div>
        </div>
      ) : !authStatus?.connected ? (
        <div className="p-6 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
              <Radio size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Channel YouTube Belum Terhubung</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Hubungkan channel YouTube GMS Multimedia sekali untuk sinkronisasi upcoming stream, kontrol start/stop, dan studio matrix.
              </p>
              {authStatus?.authError && (
                <p className="text-xs text-red-500 mt-1">Status: {authStatus.authError}</p>
              )}
            </div>
          </div>
          <a
            href="/api/youtube/auth?action=login"
            className="px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors shadow-sm"
          >
            <Radio size={14} />
            Hubungkan Akun YouTube
          </a>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {authStatus.channel?.avatar ? (
              <Image
                src={authStatus.channel.avatar}
                alt={authStatus.channel.title}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                <Radio size={18} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{authStatus.channel?.title}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                  <CheckCircle2 size={11} /> Terhubung
                </span>
              </div>
              <p className="text-xs text-muted-light dark:text-muted-dark font-mono">
                {Number(authStatus.channel?.subscribers || 0).toLocaleString('id-ID')} subscriber
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 rounded-sm border border-border-light dark:border-border-dark hover:text-red-500 text-xs text-muted-light dark:text-muted-dark transition-colors flex items-center gap-1.5"
            >
              <LogOut size={13} /> Putuskan / Ganti Akun
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Toolbar */}
      {authStatus?.connected && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center gap-1 border-b sm:border-b-0 border-border-light dark:border-border-dark pb-2 sm:pb-0">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'live', label: 'Sedang Live' },
              { id: 'all', label: 'Semua Siaran' },
              { id: 'completed', label: 'Selesai' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-accent text-white'
                    : 'text-muted-light dark:text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadBroadcasts}
              disabled={loadingBroadcasts}
              title="Refresh Daftar Siaran"
              className="px-3 py-2 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs flex items-center gap-1.5 text-muted-light dark:text-muted-dark transition-colors"
            >
              <RefreshCw size={14} className={loadingBroadcasts ? 'animate-spin text-accent' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-sm bg-accent text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shadow-sm transition-opacity"
            >
              <Plus size={15} /> Buat Upcoming Stream
            </button>
          </div>
        </div>
      )}

      {/* 3. Broadcasts List */}
      {authStatus?.connected && (
        <div>
          {loadingBroadcasts ? (
            <div className="p-12 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center gap-3 text-muted-light dark:text-muted-dark">
              <Loader2 className="animate-spin text-accent" size={22} />
              <p className="text-xs">Memuat siaran YouTube...</p>
            </div>
          ) : broadcastError ? (
            <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
              <p className="font-semibold">Gagal memuat siaran:</p>
              <p className="mt-1">{broadcastError}</p>
            </div>
          ) : filteredBroadcasts.length === 0 ? (
            <div className="p-12 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center">
                <Tv size={24} />
              </div>
              <h3 className="text-sm font-semibold">Tidak ada siaran dalam filter ini</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark max-w-sm mx-auto">
                Belum ada upcoming stream yang dijadwalkan. Buat upcoming stream baru untuk ibadah atau acara mendatang.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-accent text-white text-xs font-semibold hover:opacity-90"
              >
                <Plus size={14} /> Buat Upcoming Stream Baru
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBroadcasts.map((b) => {
                const isLive = b.lifeCycleStatus === 'live'
                const isTesting = b.lifeCycleStatus === 'testing'
                const isComplete = b.lifeCycleStatus === 'complete'
                const streamKey = b.stream?.streamKey || ''
                const isEncoderConnected = b.stream?.streamStatus === 'active'

                const thumbUrl =
                  b.thumbnails?.medium?.url ||
                  b.thumbnails?.high?.url ||
                  b.thumbnails?.default?.url ||
                  null

                return (
                  <div
                    key={b.id}
                    className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm overflow-hidden transition-colors hover:border-accent/40"
                  >
                    {/* Card utama */}
                    <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      {/* Thumbnail & Title Info */}
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        {/* Thumbnail Container */}
                        <div
                          className={`relative w-36 sm:w-44 aspect-video rounded overflow-hidden bg-black shrink-0 border ${
                            isLive
                              ? 'border-red-500/60 cursor-pointer group'
                              : 'border-border-light dark:border-border-dark'
                          }`}
                          onClick={() => isLive && setWatchingId(watchingId === b.id ? null : b.id)}
                          title={isLive ? 'Klik untuk menonton siaran langsung' : undefined}
                        >
                          {thumbUrl ? (
                            <Image
                              src={thumbUrl}
                              alt={b.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                              <Radio size={24} />
                            </div>
                          )}

                          {/* Play overlay for live */}
                          {isLive && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center">
                                <MonitorPlay size={20} className="text-white" />
                              </div>
                            </div>
                          )}

                          {/* Status Overlay Badge */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                isLive
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isTesting
                                  ? 'bg-amber-500 text-white'
                                  : isComplete
                                  ? 'bg-zinc-700 text-white'
                                  : 'bg-sky-600 text-white'
                              }`}
                            >
                              {isLive ? 'LIVE' : isTesting ? 'TEST' : isComplete ? 'SELESAI' : 'UPCOMING'}
                            </span>
                          </div>

                          {/* Privacy Badge */}
                          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] uppercase font-mono flex items-center gap-1">
                            {b.privacyStatus === 'public' ? (
                              <Globe size={10} />
                            ) : b.privacyStatus === 'private' ? (
                              <Lock size={10} />
                            ) : (
                              <Eye size={10} />
                            )}
                            <span>{b.privacyStatus}</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-sm font-semibold truncate hover:text-accent cursor-pointer" onClick={() => setSelectedBroadcast(b)}>
                            {b.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-light dark:text-muted-dark">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(b.scheduledStartTime)}
                            </span>

                            <span className="flex items-center gap-1.5 font-medium">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isEncoderConnected ? 'bg-emerald-500' : 'bg-zinc-400'
                                }`}
                              />
                              {isEncoderConnected ? 'Encoder Terhubung' : 'Encoder Offline'}
                            </span>

                            {isLive && b.statistics?.concurrentViewers !== null && (
                              <span className="text-red-500 font-bold">
                                ● {b.statistics.concurrentViewers} Penonton
                              </span>
                            )}
                          </div>

                          {b.description && (
                            <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-1 opacity-80 pt-0.5">
                              {b.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-border-light dark:border-border-dark">
                        {/* Watch Live Embed Button */}
                        {isLive && (
                          <button
                            type="button"
                            onClick={() => setWatchingId(watchingId === b.id ? null : b.id)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                              watchingId === b.id
                                ? 'bg-red-600 text-white'
                                : 'bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white'
                            }`}
                          >
                            {watchingId === b.id ? <X size={13} /> : <MonitorPlay size={13} />}
                            <span>{watchingId === b.id ? 'Tutup Player' : 'Watch Live'}</span>
                          </button>
                        )}

                        {/* Copy Stream Key */}
                        {streamKey && (
                          <button
                            type="button"
                            onClick={() => handleCopyKey(streamKey, b.id)}
                            className="px-2.5 py-1.5 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs flex items-center gap-1 transition-colors"
                            title="Salin Stream Key untuk Switcher / OBS"
                          >
                            {copiedKeyId === b.id ? (
                              <Check size={13} className="text-emerald-500" />
                            ) : (
                              <Copy size={13} />
                            )}
                            <span>{copiedKeyId === b.id ? 'Tersalin' : 'Stream Key'}</span>
                          </button>
                        )}

                        {/* Start / Stop Button */}
                        {!isLive && !isComplete && (
                          <button
                            type="button"
                            disabled={actionLoadingId === b.id}
                            onClick={() => handleQuickTransition(b.id, 'live')}
                            className="px-3 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
                          >
                            {actionLoadingId === b.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Play size={13} />
                            )}
                            <span>Go Live</span>
                          </button>
                        )}

                        {isLive && (
                          <button
                            type="button"
                            disabled={actionLoadingId === b.id}
                            onClick={() => handleQuickTransition(b.id, 'complete')}
                            className="px-3 py-1.5 rounded-sm bg-zinc-700 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
                          >
                            {actionLoadingId === b.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Square size={13} />
                            )}
                            <span>Stop Stream</span>
                          </button>
                        )}

                        {/* Matrix / Detail Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedBroadcast(b)}
                          className="px-3 py-1.5 rounded-sm bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Activity size={13} />
                          <span>Studio Matrix</span>
                        </button>

                        {/* Link to YouTube Studio */}
                        <a
                          href={`https://studio.youtube.com/video/${b.id}/livestreaming`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark transition-colors"
                          title="Buka di YouTube Studio Web"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    {/* Inline Embed Player — muncul hanya saat isLive & watchingId === b.id */}
                    {isLive && watchingId === b.id && (
                      <LiveEmbedPlayer
                        videoId={b.id}
                        title={b.title}
                        viewerCount={b.statistics?.concurrentViewers}
                        onClose={() => setWatchingId(null)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateStreamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          loadBroadcasts()
        }}
      />

      <StreamMatrixModal
        broadcast={selectedBroadcast}
        isOpen={!!selectedBroadcast}
        onClose={() => setSelectedBroadcast(null)}
        onRefreshList={() => loadBroadcasts()}
      />
    </div>
  )
}
