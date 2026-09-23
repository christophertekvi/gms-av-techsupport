'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
  Radio,
  Play,
  Square,
  Users,
  Eye,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  ThumbsUp,
  Activity,
} from 'lucide-react'

export default function StreamMatrixModal({ broadcast, isOpen, onClose, onRefreshList }) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [copiedVideoUrl, setCopiedVideoUrl] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = useCallback(async () => {
    if (!broadcast?.id) return
    setLoading(true)
    try {
      const streamId = broadcast.contentDetails?.boundStreamId || broadcast.stream?.id || ''
      const res = await fetch(`/api/youtube/broadcasts/${broadcast.id}/metrics?streamId=${streamId}`)
      const data = await res.json()
      if (res.ok && data.metrics) {
        setMetrics(data.metrics)
      }
    } catch (err) {
      console.error('Gagal mengambil stream metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [broadcast])

  useEffect(() => {
    if (!isOpen || !broadcast) return
    fetchMetrics()

    let interval = null
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, 10000) // auto-refresh tiap 10 detik
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOpen, broadcast, autoRefresh, fetchMetrics])

  if (!isOpen || !broadcast) return null

  const currentStatus = metrics?.lifeCycleStatus || broadcast.lifeCycleStatus || 'created'
  const isLive = currentStatus === 'live'
  const isTesting = currentStatus === 'testing'
  const isReady = currentStatus === 'ready' || currentStatus === 'created'
  const isComplete = currentStatus === 'complete'

  const streamStatus = metrics?.streamStatus || broadcast.stream?.streamStatus || 'inactive'
  const healthStatus = metrics?.healthStatus || broadcast.stream?.healthStatus || 'noData'
  const videoUrl = `https://www.youtube.com/watch?v=${broadcast.id}`

  async function handleTransition(targetStatus) {
    const actionText =
      targetStatus === 'live' ? 'Mulai Live Streaming (Go Live)?' : 'Akhiri / Stop Live Streaming ini?'
    if (!confirm(`Konfirmasi: Apakah Anda yakin ingin ${actionText}`)) return

    setActionLoading(true)
    setActionError('')
    try {
      const res = await fetch(`/api/youtube/broadcasts/${broadcast.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      })
      const data = await res.json()
      setActionLoading(false)

      if (!res.ok) {
        setActionError(data.error || 'Gagal mengubah status siaran.')
        return
      }

      await fetchMetrics()
      if (onRefreshList) onRefreshList()
    } catch (err) {
      setActionLoading(false)
      setActionError(err.message || 'Terjadi kesalahan sistem saat mengubah status.')
    }
  }

  function handleCopyVideoUrl() {
    navigator.clipboard.writeText(videoUrl)
    setCopiedVideoUrl(true)
    setTimeout(() => setCopiedVideoUrl(false), 2000)
  }

  const getHealthBadge = (health) => {
    switch (health) {
      case 'good':
      case 'excellent':
        return {
          bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          label: 'Sangat Bagus (Excellent)',
          icon: <CheckCircle size={13} />,
        }
      case 'ok':
        return {
          bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          label: 'Normal (OK)',
          icon: <Activity size={13} />,
        }
      case 'bad':
      case 'poor':
        return {
          bg: 'bg-red-500/10 text-red-500 border-red-500/20',
          label: 'Bermasalah / Bitrate Drop',
          icon: <AlertTriangle size={13} />,
        }
      default:
        return {
          bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
          label: 'Menunggu Sinyal Encoder (No Data)',
          icon: <Clock size={13} />,
        }
    }
  }

  const healthBadge = getHealthBadge(healthStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-2xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-bg-light/60 dark:bg-bg-dark/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                isLive
                  ? 'bg-red-500 text-white animate-pulse'
                  : isTesting
                  ? 'bg-amber-500 text-white'
                  : isComplete
                  ? 'bg-zinc-500 text-white'
                  : 'bg-sky-500/20 text-sky-500 border border-sky-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-current'}`} />
              {isLive ? 'SEDANG LIVE' : isTesting ? 'TESTING' : isComplete ? 'SELESAI' : 'UPCOMING'}
            </div>
            <h2 className="font-display font-semibold text-base truncate">{broadcast.title}</h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchMetrics()}
              disabled={loading}
              title="Refresh Data Matrix"
              className="p-2 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-accent' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar & Error alerts */}
        <div className="px-6 py-3 border-b border-border-light dark:border-border-dark bg-bg-light/30 dark:bg-bg-dark/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-light dark:text-muted-dark">Stream Health:</span>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium ${healthBadge.bg}`}
            >
              {healthBadge.icon}
              {healthBadge.label}
            </span>
            <span className="text-xs text-muted-light dark:text-muted-dark ml-2">Encoder:</span>
            <span
              className={`text-xs font-mono font-medium ${
                streamStatus === 'active' ? 'text-emerald-500' : 'text-zinc-400'
              }`}
            >
              {streamStatus === 'active' ? '● TERHUBUNG' : '○ TIDAK AKTIF'}
            </span>
          </div>

          {/* Action Buttons & Links */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyVideoUrl}
              className="px-3 py-1.5 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs flex items-center gap-1.5 transition-colors"
              title="Salin Link / URL Video YouTube"
            >
              {copiedVideoUrl ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedVideoUrl ? 'URL Tersalin' : 'Copy URL Video'}</span>
            </button>

            {!isLive && !isComplete && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleTransition('live')}
                className="px-4 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
              >
                {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                Mulai Siaran (Go Live)
              </button>
            )}

            {isLive && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleTransition('complete')}
                className="px-4 py-1.5 rounded-sm bg-zinc-700 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
              >
                {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Square size={13} />}
                Akhiri Siaran (Stop)
              </button>
            )}

            <a
              href={`https://studio.youtube.com/video/${broadcast.id}/livestreaming`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-sm border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs flex items-center gap-1 transition-colors"
            >
              <span>YouTube Studio</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {actionError && (
          <div className="mx-6 mt-4 p-3 text-xs rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Matrix Stats Cards (YouTube Studio Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50">
              <div className="flex items-center justify-between text-muted-light dark:text-muted-dark mb-1">
                <span className="text-xs font-mono uppercase tracking-wide">Penonton Aktif</span>
                <Users size={16} className={isLive ? 'text-red-500' : ''} />
              </div>
              <p className="text-2xl font-bold font-display">
                {metrics?.concurrentViewers !== null && metrics?.concurrentViewers !== undefined
                  ? metrics.concurrentViewers.toLocaleString('id-ID')
                  : '0'}
              </p>
              <p className="text-[11px] text-muted-light dark:text-muted-dark mt-0.5">
                {isLive ? 'Concurrent Viewers' : 'Siaran belum live'}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50">
              <div className="flex items-center justify-between text-muted-light dark:text-muted-dark mb-1">
                <span className="text-xs font-mono uppercase tracking-wide">Total Tayangan</span>
                <Eye size={16} />
              </div>
              <p className="text-2xl font-bold font-display">
                {(metrics?.totalViews || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-muted-light dark:text-muted-dark mt-0.5">Total View Count</p>
            </div>

            <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50">
              <div className="flex items-center justify-between text-muted-light dark:text-muted-dark mb-1">
                <span className="text-xs font-mono uppercase tracking-wide">Total Suka</span>
                <ThumbsUp size={16} />
              </div>
              <p className="text-2xl font-bold font-display">
                {(metrics?.likeCount || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-muted-light dark:text-muted-dark mt-0.5">Likes</p>
            </div>

            <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50">
              <div className="flex items-center justify-between text-muted-light dark:text-muted-dark mb-1">
                <span className="text-xs font-mono uppercase tracking-wide">Status Stream</span>
                <Activity size={16} />
              </div>
              <p className="text-lg font-bold font-display capitalize truncate">
                {streamStatus === 'active' ? (
                  <span className="text-emerald-500">Menerima Data</span>
                ) : (
                  <span className="text-zinc-400">Offline</span>
                )}
              </p>
              <p className="text-[11px] text-muted-light dark:text-muted-dark mt-0.5">
                Latency: {broadcast.contentDetails?.latencyPreference || 'normal'}
              </p>
            </div>
          </div>

          {/* Expanded Video Embed Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-light dark:text-muted-dark flex items-center gap-2">
                <Radio size={14} className={isLive ? 'text-red-500 animate-pulse' : ''} />
                <span>Pratinjau Siaran (Live Player Embed)</span>
              </h4>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyVideoUrl}
                  className="text-xs px-2.5 py-1 rounded border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark hover:text-accent flex items-center gap-1.5 transition-colors"
                  title="Salin URL Video YouTube"
                >
                  {copiedVideoUrl ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copiedVideoUrl ? 'URL Tersalin' : 'Salin URL Video'}</span>
                </button>

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1 rounded border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark hover:text-accent flex items-center gap-1.5 transition-colors"
                >
                  <span>Buka di YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Video Container (Expanded, Full Width) */}
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${broadcast.id}?autoplay=0&mute=1`}
                title={broadcast.title || 'YouTube Preview'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Broadcast Details Meta Bar */}
            <div className="p-3.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light/40 dark:bg-bg-dark/40 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-muted-light dark:text-muted-dark">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>
                    Jadwal:{' '}
                    <strong className="text-foreground-light dark:text-foreground-dark">
                      {broadcast.scheduledStartTime
                        ? new Date(broadcast.scheduledStartTime).toLocaleString('id-ID', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })
                        : '-'}
                    </strong>
                  </span>
                </span>

                <span>
                  Privasi:{' '}
                  <strong className="uppercase text-foreground-light dark:text-foreground-dark font-mono">
                    {broadcast.privacyStatus}
                  </strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
                <span>
                  Auto-Start:{' '}
                  <strong className={broadcast.contentDetails?.enableAutoStart ? 'text-emerald-500' : 'text-zinc-400'}>
                    {broadcast.contentDetails?.enableAutoStart ? 'Aktif' : 'Non-aktif'}
                  </strong>
                </span>
                <span>
                  Auto-Stop:{' '}
                  <strong className={broadcast.contentDetails?.enableAutoStop ? 'text-emerald-500' : 'text-zinc-400'}>
                    {broadcast.contentDetails?.enableAutoStop ? 'Aktif' : 'Non-aktif'}
                  </strong>
                </span>
                <span>
                  DVR (Rewind):{' '}
                  <strong className={broadcast.contentDetails?.enableDvr ? 'text-emerald-500' : 'text-zinc-400'}>
                    {broadcast.contentDetails?.enableDvr ? 'Aktif' : 'Non-aktif'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Health Warnings if any */}
            {metrics?.healthIssues && metrics.healthIssues.length > 0 && (
              <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Catatan Konfigurasi Encoder:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {metrics.healthIssues.map((issue, idx) => (
                    <li key={idx}>{issue.description || issue.reason || JSON.stringify(issue)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border-light dark:border-border-dark bg-bg-light/40 dark:bg-bg-dark/40 flex items-center justify-between shrink-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-light dark:text-muted-dark">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-accent"
            />
            <span>Auto-refresh matrix tiap 10 detik</span>
          </label>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-bg-light dark:hover:bg-bg-dark text-xs font-medium"
          >
            Tutup Matrix
          </button>
        </div>
      </div>
    </div>
  )
}
