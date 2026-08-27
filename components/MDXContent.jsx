import { MDXRemote } from 'next-mdx-remote/rsc'

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return ''
  const trimmed = urlOrId.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = trimmed.match(regExp)
  return match ? match[1] : trimmed
}

function YouTube({ id, url, title = 'YouTube Video Player' }) {
  const videoId = extractYouTubeId(id || url)
  if (!videoId) return null

  return (
    <div className="my-6 w-full overflow-hidden rounded-lg border border-border-light dark:border-border-dark aspect-video bg-black shadow-sm">
      <iframe
        className="w-full h-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
