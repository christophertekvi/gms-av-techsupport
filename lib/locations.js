export const LOCATIONS = [
  { slug: 'rooftop', label: 'Rooftop', description: 'GMS Surabaya Barat' },
  { slug: 'pcm', label: 'PCM', description: 'GMS Surabaya Timur' },
  { slug: 'mcc', label: 'MCC', description: 'GMS Surabaya Selatan' },
  { slug: 'gc', label: 'GC', description: 'GMS Surabaya Pusat Utara' },
]

export function getLocation(slug) {
  return LOCATIONS.find((l) => l.slug === slug)
}
