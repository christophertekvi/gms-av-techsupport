export const WILAYAH = [
  { slug: 'rooftop', label: 'Rooftop', description: 'GMS Surabaya Barat' },
  { slug: 'pcm', label: 'PCM', description: 'GMS Surabaya Timur' },
  { slug: 'mcc', label: 'MCC', description: 'GMS Surabaya Selatan' },
  { slug: 'gc', label: 'GC', description: 'GMS Surabaya Pusat Utara' },
]

export const LOCATIONS = WILAYAH

export function getLocation(slug) {
  if (!slug) return null
  
  // Check direct matching wilayah slug (e.g. 'rooftop')
  const w = WILAYAH.find((l) => l.slug === slug)
  if (w) return w

  // Check nested room slug (e.g. 'rooftop-ek-1')
  const dashIndex = slug.indexOf('-')
  if (dashIndex > 0) {
    const parentSlug = slug.substring(0, dashIndex)
    const roomSub = slug.substring(dashIndex + 1)
    const parent = WILAYAH.find((l) => l.slug === parentSlug)
    if (parent) {
      return {
        slug,
        label: `${parent.label} - ${roomSub.toUpperCase().replace('-', ' ')}`,
        parentSlug,
        roomSlug: roomSub
      }
    }
  }
  return null
}

