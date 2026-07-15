export const LOCATIONS = [
  { slug: 'rooftop', label: 'Rooftop', description: 'Area produksi & peralatan di rooftop' },
  { slug: 'pcm', label: 'PCM', description: 'Ruang produksi PCM' },
  { slug: 'mcc', label: 'MCC', description: 'Master Control Center' },
  { slug: 'gc', label: 'GC', description: 'Ruang GC' },
]

export function getLocation(slug) {
  return LOCATIONS.find((l) => l.slug === slug)
}
