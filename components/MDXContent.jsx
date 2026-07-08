import { MDXRemote } from 'next-mdx-remote/rsc'

export default function MDXContent({ source }) {
  return (
    <div className="prose-av">
      <MDXRemote source={source} />
    </div>
  )
}
