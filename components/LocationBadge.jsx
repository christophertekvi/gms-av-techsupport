import Link from 'next/link'
import { getLocation } from '@/lib/locations'
import { MapPin } from 'lucide-react'

export default function LocationBadge({ slug }) {
  const location = getLocation(slug)
  if (!location) return null

  const href = location.parentSlug
    ? `/wilayah/${location.parentSlug}/${location.roomSlug}`
    : `/wilayah/${slug}`

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-sm border border-border-light dark:border-border-dark px-2 py-0.5 text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark hover:text-accent hover:border-accent transition-colors"
    >
      <MapPin size={11} />
      {location.label}
    </Link>
  )
}

