'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Maximize2, ExternalLink, X, Tv } from 'lucide-react'

/**
 * Urutan kualitas dari tertinggi ke terendah yang akan dicoba
 */
const QUALITY_LEVELS = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']

const QUALITY_LABELS = {
  hd2160: '4K (2160p)',
  hd1440: '1440p QHD',
  hd1080: '1080p HD',
  hd720: '720p HD',
  large: '480p',
  medium: '360p',
  small: '240p',
  auto: 'Auto',
}

// Singleton loader agar script hanya dimuat sekali
let ytApiLoadPromise = null

function loadYouTubeIframeAPI() {
  if (typeof window === 'undefined') return Promise.reject()
  if (window.YT && window.YT.Player) return Promise.resolve()
  if (ytApiLoadPromise) return ytApiLoadPromise

  ytApiLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev()
      resolve()
    }
  })

  return ytApiLoadPromise
}

export default function LiveEmbedPlayer({ videoId, title, viewerCount, onClose }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [currentQuality, setCurrentQuality] = useState(null)
  const [availableQualities, setAvailableQualities] = useState([])

  useEffect(() => {
    if (!videoId) return

    let destroyed = false

    loadYouTubeIframeAPI()
      .then(() => {
        if (destroyed || !containerRef.current) return

        // Bersihkan instance lama
        if (playerRef.current) {
          try { playerRef.current.destroy() } catch {}
          playerRef.current = null
        }

        // Buat div mount target segar
        const mountDiv = document.createElement('div')
        mountDiv.id = `yt-player-${videoId}-${Date.now()}`
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(mountDiv)

        playerRef.current = new window.YT.Player(mountDiv.id, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            controls: 1,
            enablejsapi: 1,
            vq: 'hd2160', // Hint awal ke YouTube untuk kualitas tertinggi
          },
          events: {
            onReady: (event) => {
              if (destroyed) return
              setStatus('ready')

              // Ambil semua kualitas yang tersedia
              const qualities = event.target.getAvailableQualityLevels?.() || []
              if (qualities.length > 0) setAvailableQualities(qualities)

              // Pilih kualitas tertinggi yang tersedia
              const best = QUALITY_LEVELS.find((q) => qualities.includes(q)) || 'hd2160'
              try { event.target.setPlaybackQuality(best) } catch {}
              setCurrentQuality(event.target.getPlaybackQuality?.() || best)
            },

            onPlaybackQualityChange: (event) => {
              if (destroyed) return
              setCurrentQuality(event.data)

              // Jika YouTube auto-downgrade, paksa balik ke tertinggi
              const qualities = playerRef.current?.getAvailableQualityLevels?.() || []
              const best = QUALITY_LEVELS.find((q) => qualities.includes(q))
              if (best && event.data !== best) {
                try { playerRef.current?.setPlaybackQuality(best) } catch {}
              }
            },

            onStateChange: (event) => {
              if (destroyed) return
              // Saat buffering/playing, pastikan quality masih di tertinggi & update daftar
              if (
                event.data === window.YT?.PlayerState?.BUFFERING ||
                event.data === window.YT?.PlayerState?.PLAYING
              ) {
                const qualities = playerRef.current?.getAvailableQualityLevels?.() || []
                if (qualities.length > 0) setAvailableQualities(qualities)
                const best = QUALITY_LEVELS.find((q) => qualities.includes(q))
                if (best) {
                  try { playerRef.current?.setPlaybackQuality(best) } catch {}
                }
              }
            },

            onError: () => {
              if (!destroyed) setStatus('error')
            },
          },
        })
      })
      .catch(() => {
        if (!destroyed) setStatus('error')
      })

    return () => {
      destroyed = true
      try { playerRef.current?.destroy() } catch {}
      playerRef.current = null
    }
  }, [videoId])

  const handleSetQuality = (q) => {
    try {
      playerRef.current?.setPlaybackQuality(q)
      setCurrentQuality(q)
    } catch {}
  }

  const handleFullscreen = () => {
    const iframe = containerRef.current?.querySelector('iframe')
    if (!iframe) return
    if (iframe.requestFullscreen) iframe.requestFullscreen()
    else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen()
  }

  const qualityColor = (q) => {
    if (q === 'hd2160' || q === 'hd1440') return 'text-violet-400'
    if (q === 'hd1080') return 'text-blue-400'
    if (q === 'hd720') return 'text-emerald-400'
    return 'text-zinc-400'
  }

  const qualityActiveBadge = () => {
    if (currentQuality === 'hd2160') return <span className="text-violet-400 font-semibold ml-1">✦ 4K Ultra HD aktif</span>
    if (currentQuality === 'hd1440') return <span className="text-violet-300 font-semibold ml-1">✦ QHD 1440p aktif</span>
    if (currentQuality === 'hd1080') return <span className="text-blue-400 font-semibold ml-1">✦ Full HD 1080p aktif</span>
    return null
  }

  return (
    <div className="border-t border-red-500/20 bg-black">

      {/* ── Player Header ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-red-900/20 border-b border-red-500/20 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-xs font-bold text-red-400 shrink-0 uppercase tracking-wide">Siaran Langsung</span>
          <span className="text-xs text-zinc-500 truncate hidden sm:block">— {title}</span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {viewerCount != null && (
            <span className="text-xs text-red-400 font-bold">● {viewerCount} Penonton</span>
          )}

          {/* Kualitas aktif badge */}
          {currentQuality && (
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10 bg-black/60 ${qualityColor(currentQuality)}`}>
              {QUALITY_LABELS[currentQuality] || currentQuality}
            </span>
          )}

          {/* Dropdown pilih kualitas manual */}
          {availableQualities.length > 0 && (
            <select
              value={currentQuality || ''}
              onChange={(e) => handleSetQuality(e.target.value)}
              className="text-[10px] bg-zinc-900 border border-white/10 text-zinc-300 rounded px-1.5 py-0.5 outline-none cursor-pointer"
              title="Pilih Kualitas"
            >
              {availableQualities.map((q) => (
                <option key={q} value={q}>
                  {QUALITY_LABELS[q] || q}
                </option>
              ))}
            </select>
          )}

          <button type="button" onClick={handleFullscreen} className="text-zinc-500 hover:text-white transition-colors" title="Fullscreen">
            <Maximize2 size={14} />
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-accent transition-colors"
            title="Buka di YouTube"
          >
            <ExternalLink size={14} />
          </a>

          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-red-400 transition-colors" title="Tutup Player">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Player Area ── */}
      <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-black">
            <Loader2 size={32} className="animate-spin text-red-500" />
            <p className="text-xs text-zinc-500">Memuat siaran langsung...</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-black">
            <Tv size={32} className="text-zinc-700" />
            <p className="text-xs text-zinc-500">Gagal memuat player YouTube.</p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent underline"
            >
              Buka di YouTube ↗
            </a>
          </div>
        )}

        {/* Player mount target */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* ── Quality Info Bar ── */}
      <div className="px-4 py-1.5 bg-zinc-950 border-t border-white/5 flex items-center justify-between gap-4">
        <p className="text-[10px] text-zinc-600 leading-relaxed">
          Kualitas diatur otomatis ke resolusi tertinggi yang tersedia.
          {qualityActiveBadge()}
        </p>
        {availableQualities.length > 0 && (
          <p className="text-[10px] text-zinc-700 shrink-0">
            {availableQualities.map((q) => QUALITY_LABELS[q] || q).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}
