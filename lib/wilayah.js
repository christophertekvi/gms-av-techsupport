export const WILAYAH = [
  { slug: 'rooftop', label: 'Rooftop', description: 'Area produksi & peralatan di rooftop' },
  { slug: 'pcm', label: 'PCM', description: 'Ruang produksi PCM' },
  { slug: 'mcc', label: 'MCC', description: 'Master Control Center' },
  { slug: 'gc', label: 'GC', description: 'Ruang GC' },
]

export function getWilayah(slug) {
  return WILAYAH.find((w) => w.slug === slug)
}