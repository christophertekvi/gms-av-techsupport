import { MDXRemote } from 'next-mdx-remote/rsc'

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return ''
  const str = urlOrId.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str
  }

  try {
    const url = new URL(str.startsWith('http') ? str : `https://${str}`)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1).split(/[?#&/]/)[0]
      if (id) return id
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/embed/')[1].split(/[?#&/]/)[0]
      }
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/shorts/')[1].split(/[?#&/]/)[0]
      }
      if (url.pathname.startsWith('/v/')) {
        return url.pathname.split('/v/')[1].split(/[?#&/]/)[0]
      }
      const v = url.searchParams.get('v')
      if (v) return v
    }
  } catch (e) {}

  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  return match ? match[1] : str
}

function YouTube({ id, url, title = 'YouTube Video Player' }) {
  const videoId = extractYouTubeId(id || url)
  if (!videoId) return null

  return (
    <div className="my-6 w-full overflow-hidden rounded-lg border border-border-light dark:border-border-dark aspect-video bg-black shadow-sm">
      <iframe
        className="w-full h-full border-0"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}

const components = {
  YouTube,
  Youtube: YouTube,
}

export default function MDXContent({ source }) {
  return (
    <div className="prose-av">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
