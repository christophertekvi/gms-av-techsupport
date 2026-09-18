import fs from 'fs'
import path from 'path'

const TOKEN_FILE = path.join(process.cwd(), '.youtube-tokens.json')

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
]

/**
 * Membaca token OAuth dari file penyimpanan lokal atau env
 */
export function getStoredTokens() {
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const data = fs.readFileSync(TOKEN_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (parsed?.refresh_token) return parsed
    } catch {
      // ignore parse error
    }
  }

  if (process.env.YOUTUBE_REFRESH_TOKEN) {
    return {
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      access_token: process.env.YOUTUBE_ACCESS_TOKEN || null,
      expiry_date: null,
    }
  }

  return null
}

/**
 * Menyimpan token OAuth ke file lokal
 */
export function saveTokens(tokens) {
  try {
    const existing = getStoredTokens() || {}
    const updated = {
      ...existing,
      ...tokens,
      updated_at: new Date().toISOString(),
    }
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(updated, null, 2), 'utf-8')
    return updated
  } catch (err) {
    console.error('Gagal menyimpan tokens YouTube:', err)
    return tokens
  }
}

/**
 * Menghapus token (Disconnect channel)
 */
export function clearTokens() {
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      fs.unlinkSync(TOKEN_FILE)
    } catch (err) {
      console.error('Gagal menghapus token file:', err)
    }
  }
}

/**
 * Generate Google OAuth 2.0 URL
 */
export function getOAuthUrl(redirectUri) {
  const clientId = process.env.YOUTUBE_CLIENT_ID
  if (!clientId) {
    throw new Error('YOUTUBE_CLIENT_ID belum diatur di file .env.local.')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: YOUTUBE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Menukar authorization code dengan Access & Refresh Token
 */
export async function exchangeCode(code, redirectUri) {
  const clientId = process.env.YOUTUBE_CLIENT_ID
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('YOUTUBE_CLIENT_ID dan YOUTUBE_CLIENT_SECRET harus diatur di .env.local.')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Gagal menukar authorization code.')
  }

  const expiryDate = Date.now() + (data.expires_in || 3600) * 1000
  const tokenRecord = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: expiryDate,
    scope: data.scope,
    token_type: data.token_type,
  }

  saveTokens(tokenRecord)
  return tokenRecord
}

/**
 * Mendapatkan Access Token yang valid (auto-refresh jika expired)
 */
export async function getValidAccessToken() {
  const tokens = getStoredTokens()
  if (!tokens || !tokens.refresh_token) {
    throw new Error('Channel YouTube belum terhubung via OAuth.')
  }

  // Jika token masih valid (dengan buffer 60 detik), langsung gunakan
  if (tokens.access_token && tokens.expiry_date && Date.now() < tokens.expiry_date - 60000) {
    return tokens.access_token
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('YOUTUBE_CLIENT_ID dan YOUTUBE_CLIENT_SECRET harus diatur di .env.local.')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Gagal me-refresh YouTube access token.')
  }

  const updatedTokens = {
    ...tokens,
    access_token: data.access_token,
    expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
  }

  saveTokens(updatedTokens)
  return updatedTokens.access_token
}

/**
 * Helper request ke YouTube Data API v3
 */
export async function youtubeFetch(endpoint, options = {}) {
  const accessToken = await getValidAccessToken()

  const url = endpoint.startsWith('http') ? endpoint : `https://www.googleapis.com/youtube/v3/${endpoint}`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const errorMsg = data?.error?.message || data?.error?.errors?.[0]?.message || `YouTube API Error (${res.status})`
    const err = new Error(errorMsg)
    err.status = res.status
    err.details = data?.error
    throw err
  }

  return data
}

/**
 * Mengambil profil Channel yang sedang terhubung
 */
export async function getChannelProfile() {
  const data = await youtubeFetch('channels?part=snippet,contentDetails,statistics&mine=true')
  const item = data.items?.[0]
  if (!item) return null

  return {
    id: item.id,
    title: item.snippet?.title || 'Unknown Channel',
    description: item.snippet?.description || '',
    customUrl: item.snippet?.customUrl || '',
    avatar: item.snippet?.thumbnails?.default?.url || item.snippet?.thumbnails?.medium?.url || '',
    subscribers: item.statistics?.subscriberCount || 0,
  }
}

/**
 * Mengambil semua Broadcasts (Upcoming & Live) + informasi Stream RTMP-nya
 */
export async function listBroadcasts() {
  // 1. Ambil broadcasts
  const broadcastData = await youtubeFetch(
    'liveBroadcasts?part=snippet,contentDetails,status,statistics&broadcastType=all&mine=true&maxResults=50'
  )
  const broadcasts = broadcastData.items || []

  // 2. Ambil semua live streams untuk mengambil rtmp url, stream key, dan health
  let streamsMap = {}
  try {
    const streamData = await youtubeFetch('liveStreams?part=snippet,cdn,status&mine=true&maxResults=50')
    for (const stream of streamData.items || []) {
      streamsMap[stream.id] = stream
    }
  } catch (err) {
    console.warn('Gagal mengambil detail liveStreams:', err.message)
  }

  // 3. Gabungkan informasi broadcast dan stream
  return broadcasts.map((b) => {
    const boundStreamId = b.contentDetails?.boundStreamId
    const boundStream = boundStreamId ? streamsMap[boundStreamId] : null

    return {
      id: b.id,
      title: b.snippet?.title || 'Tanpa Judul',
      description: b.snippet?.description || '',
      scheduledStartTime: b.snippet?.scheduledStartTime || null,
      actualStartTime: b.snippet?.actualStartTime || null,
      actualEndTime: b.snippet?.actualEndTime || null,
      thumbnails: b.snippet?.thumbnails || {},
      privacyStatus: b.status?.privacyStatus || 'unlisted', // public, unlisted, private
      lifeCycleStatus: b.status?.lifeCycleStatus || 'created', // ready, testing, live, complete, revoked, created
      recordingStatus: b.status?.recordingStatus || null,
      contentDetails: {
        latencyPreference: b.contentDetails?.latencyPreference || 'normal',
        enableAutoStart: !!b.contentDetails?.enableAutoStart,
        enableAutoStop: !!b.contentDetails?.enableAutoStop,
        enableDvr: !!b.contentDetails?.enableDvr,
        boundStreamId,
      },
      statistics: {
        concurrentViewers: b.statistics?.concurrentViewers ? Number(b.statistics.concurrentViewers) : null,
      },
      stream: boundStream
        ? {
            id: boundStream.id,
            streamStatus: boundStream.status?.streamStatus || 'inactive', // active, inactive, ready, error
            healthStatus: boundStream.status?.healthStatus?.status || 'noData', // good, ok, bad, noData
            healthDetails: boundStream.status?.healthStatus?.configurationIssues || [],
            rtmpUrl: boundStream.cdn?.ingestionInfo?.ingestionAddress || 'rtmp://a.rtmp.youtube.com/live2',
            backupRtmpUrl: boundStream.cdn?.ingestionInfo?.backupIngestionAddress || 'rtmp://b.rtmp.youtube.com/live2?backup=1',
            streamKey: boundStream.cdn?.ingestionInfo?.streamName || '',
          }
        : null,
    }
  })
}

/**
 * Mengambil daftar Stream Key (RTMP Ingestion) yang sudah ada di channel
 */
export async function listExistingStreams() {
  const data = await youtubeFetch('liveStreams?part=snippet,cdn,status&mine=true&maxResults=50')
  return (data.items || []).map((s) => ({
    id: s.id,
    title: s.snippet?.title || 'Default Stream Key',
    description: s.snippet?.description || '',
    rtmpUrl: s.cdn?.ingestionInfo?.ingestionAddress || 'rtmp://a.rtmp.youtube.com/live2',
    backupRtmpUrl: s.cdn?.ingestionInfo?.backupIngestionAddress || '',
    streamKey: s.cdn?.ingestionInfo?.streamName || '',
    streamStatus: s.status?.streamStatus || 'inactive',
    resolution: s.cdn?.resolution || 'variable',
    frameRate: s.cdn?.frameRate || 'variable',
  }))
}

/**
 * Mengambil daftar Playlist milik channel
 */
export async function listPlaylists() {
  const data = await youtubeFetch('playlists?part=snippet,contentDetails&mine=true&maxResults=50')
  return (data.items || []).map((p) => ({
    id: p.id,
    title: p.snippet?.title || 'Untitled Playlist',
    description: p.snippet?.description || '',
    itemCount: p.contentDetails?.itemCount || 0,
    thumbnail: p.snippet?.thumbnails?.default?.url || p.snippet?.thumbnails?.medium?.url || '',
  }))
}

/**
 * Memasukkan video ke dalam playlist
 */
export async function addVideoToPlaylist(playlistId, videoId) {
  if (!playlistId || !videoId) return null
  return await youtubeFetch('playlistItems?part=snippet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId,
        },
      },
    }),
  })
}

/**
 * Memperbarui metadata video (kategori)
 */
export async function updateVideoMetadata(videoId, { title, description, categoryId }) {
  if (!videoId || !categoryId) return null
  return await youtubeFetch('videos?part=snippet', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: videoId,
      snippet: {
        title,
        description: description || '',
        categoryId: String(categoryId),
      },
    }),
  })
}

/**
 * Membuat Upcoming Live Broadcast baru + RTMP Live Stream (Existing/New) & Bind
 */
export async function createBroadcastAndStream({
  title,
  description = '',
  scheduledStartTime,
  privacyStatus = 'unlisted',
  latencyPreference = 'normal',
  enableAutoStart = false,
  enableAutoStop = false,
  enableDvr = true,
  streamId = null, // ID stream key yang sudah ada (jika dipilih)
  playlistId = null, // ID playlist tujuan (jika dipilih)
  categoryId = null, // Kategori YouTube (misal '29' Nonprofits)
}) {
  if (!title) throw new Error('Judul streaming wajib diisi.')
  if (!scheduledStartTime) throw new Error('Jadwal mulai siaran wajib diisi.')

  // Pastikan format ISO 8601 (misal 2026-09-18T10:00:00Z)
  const scheduledTimeIso = new Date(scheduledStartTime).toISOString()

  // 1. Insert live broadcast
  const broadcastRes = await youtubeFetch('liveBroadcasts?part=snippet,contentDetails,status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippet: {
        title,
        description,
        scheduledStartTime: scheduledTimeIso,
      },
      contentDetails: {
        latencyPreference,
        enableAutoStart,
        enableAutoStop,
        enableDvr,
      },
      status: {
        privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    }),
  })

  const broadcastId = broadcastRes.id

  // 2. Stream Key Handling: Gunakan yang sudah ada jika dipilih, atau buat baru
  let boundStreamId = streamId
  let rtmpUrl = 'rtmp://a.rtmp.youtube.com/live2'
  let streamKey = ''

  if (boundStreamId) {
    // Ambil detail stream key yang dipilih
    try {
      const sData = await youtubeFetch(`liveStreams?part=snippet,cdn,status&id=${boundStreamId}`)
      const s = sData.items?.[0]
      if (s) {
        rtmpUrl = s.cdn?.ingestionInfo?.ingestionAddress || rtmpUrl
        streamKey = s.cdn?.ingestionInfo?.streamName || ''
      }
    } catch (err) {
      console.warn('Gagal membaca detail existing stream:', err)
    }
  } else {
    // Buat live stream RTMP baru jika user memilih 'buat baru'
    try {
      const streamRes = await youtubeFetch('liveStreams?part=snippet,cdn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snippet: {
            title: `Stream: ${title.slice(0, 80)}`,
          },
          cdn: {
            frameRate: 'variable',
            ingestionType: 'rtmp',
            resolution: 'variable',
          },
        }),
      })
      boundStreamId = streamRes.id
      rtmpUrl = streamRes.cdn?.ingestionInfo?.ingestionAddress || rtmpUrl
      streamKey = streamRes.cdn?.ingestionInfo?.streamName || ''
    } catch (err) {
      console.error('Gagal membuat live stream RTMP:', err)
      throw new Error(`Broadcast dibuat (ID: ${broadcastId}), tetapi gagal membuat RTMP Stream: ${err.message}`)
    }
  }

  // 3. Bind Live Broadcast dengan Live Stream
  let bindRes = null
  try {
    bindRes = await youtubeFetch(
      `liveBroadcasts/bind?id=${broadcastId}&part=id,contentDetails&streamId=${boundStreamId}`,
      { method: 'POST' }
    )
  } catch (err) {
    console.error('Gagal me-bind broadcast dengan stream:', err)
    throw new Error(`Gagal menyambungkan stream RTMP ke Broadcast: ${err.message}`)
  }

  // 4. Enable embedding (Allow Playback on Other Websites)
  try {
    await youtubeFetch('videos?part=status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: broadcastId,
        status: {
          embeddable: true,
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      }),
    })
  } catch (err) {
    console.warn('Gagal mengatur embeddable:', err.message)
  }

  // 5. Update Kategori (jika dipilih)
  if (categoryId) {
    try {
      await updateVideoMetadata(broadcastId, { title, description, categoryId })
    } catch (err) {
      console.warn('Gagal mengatur kategori video:', err.message)
    }
  }

  // 6. Masukkan ke Playlist (jika dipilih)
  if (playlistId) {
    try {
      await addVideoToPlaylist(playlistId, broadcastId)
    } catch (err) {
      console.warn('Gagal menambahkan video ke playlist:', err.message)
    }
  }

  return {
    broadcastId,
    streamId: boundStreamId,
    title,
    scheduledStartTime: scheduledTimeIso,
    privacyStatus,
    rtmpUrl,
    streamKey,
    playlistId,
    categoryId,
    broadcast: bindRes,
  }
}


/**
 * Mengubah status siaran (Start Streaming atau Stop Streaming)
 * targetStatus:
 * - 'testing': Mulai pengujian monitor stream (jika monitor stream aktif)
 * - 'live': Siaran langsung dimulai ke penonton (Go Live)
 * - 'complete': Mengakhiri siaran langsung (Stop Stream)
 */
export async function transitionBroadcast(broadcastId, targetStatus) {
  if (!broadcastId) throw new Error('broadcastId wajib diisi.')
  if (!['testing', 'live', 'complete'].includes(targetStatus)) {
    throw new Error(`Target status tidak valid: ${targetStatus}. Pilihan: testing, live, complete`)
  }

  return await youtubeFetch(
    `liveBroadcasts/transition?broadcastStatus=${targetStatus}&id=${broadcastId}&part=id,status,snippet,contentDetails`,
    {
      method: 'POST',
    }
  )
}

/**
 * Mengambil realtime matrix YouTube Studio untuk siaran tertentu
 */
export async function getBroadcastMetrics(broadcastId, streamId = null) {
  const results = {
    broadcastId,
    concurrentViewers: 0,
    totalViews: 0,
    likeCount: 0,
    streamStatus: 'inactive',
    healthStatus: 'noData',
    healthIssues: [],
    actualStartTime: null,
    lifeCycleStatus: 'created',
  }

  // Ambil data broadcast
  try {
    const bData = await youtubeFetch(
      `liveBroadcasts?part=snippet,contentDetails,status,statistics&id=${broadcastId}`
    )
    const b = bData.items?.[0]
    if (b) {
      results.lifeCycleStatus = b.status?.lifeCycleStatus || 'created'
      results.actualStartTime = b.snippet?.actualStartTime || null
      results.concurrentViewers = b.statistics?.concurrentViewers ? Number(b.statistics.concurrentViewers) : 0
      results.totalViews = b.statistics?.viewCount ? Number(b.statistics.viewCount) : 0
      results.likeCount = b.statistics?.likeCount ? Number(b.statistics.likeCount) : 0
      if (!streamId && b.contentDetails?.boundStreamId) {
        streamId = b.contentDetails.boundStreamId
      }
    }
  } catch (err) {
    console.warn('Gagal ambil broadcast metric:', err.message)
  }

  // Ambil data health stream dari liveStreams
  if (streamId) {
    try {
      const sData = await youtubeFetch(`liveStreams?part=snippet,cdn,status&id=${streamId}`)
      const s = sData.items?.[0]
      if (s) {
        results.streamStatus = s.status?.streamStatus || 'inactive'
        results.healthStatus = s.status?.healthStatus?.status || 'noData'
        results.healthIssues = s.status?.healthStatus?.configurationIssues || []
        results.rtmpUrl = s.cdn?.ingestionInfo?.ingestionAddress || 'rtmp://a.rtmp.youtube.com/live2'
        results.streamKey = s.cdn?.ingestionInfo?.streamName || ''
      }
    } catch (err) {
      console.warn('Gagal ambil stream health metric:', err.message)
    }
  }

  return results
}
