import { MDXRemote } from 'next-mdx-remote/rsc'

const Youtube = ({ id }) => (
  <div className="relative aspect-video my-6 w-full overflow-hidden rounded-md border border-border-light dark:border-border-dark">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)

const Vimeo = ({ id }) => (
  <div className="relative aspect-video my-6 w-full overflow-hidden rounded-md border border-border-light dark:border-border-dark">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={`https://player.vimeo.com/video/${id}`}
      title="Vimeo video player"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)

export default function MDXContent({ source }) {
  return (
    <div className="prose-av">
      <MDXRemote source={source} components={{ Youtube, Vimeo }} />
    </div>
  )
}
