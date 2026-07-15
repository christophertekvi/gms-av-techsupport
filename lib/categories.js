export const WILAYAH = [
  { slug: 'rooftop', label: 'Rooftop', description: 'Ruangan dan peralatan di area Rooftop' },
  { slug: 'pcm', label: 'PCM', description: 'Ruangan dan peralatan di area PCM' },
  { slug: 'mcc', label: 'MCC', description: 'Ruangan dan peralatan di area MCC' },
  { slug: 'gc', label: 'GC', description: 'Ruangan dan peralatan di area GC' },
]

export const CATEGORIES = [
  { slug: 'camera', label: 'Camera', description: 'Operasi & troubleshooting kamera siaran' },
  { slug: 'switcher', label: 'Switcher', description: 'ATEM, vMix, Resolume, dan video mixer lain' },
  { slug: 'streaming', label: 'Streaming', description: 'Encoder, platform live streaming, koneksi' },
  { slug: 'audio', label: 'Audio', description: 'Mixer, mic, monitor, dan signal chain audio' },
  { slug: 'display', label: 'Display & LED', description: 'Projector, LED wall, controller, sync' },
  { slug: 'network', label: 'Network', description: 'Jaringan, firewall, dan konektivitas venue' },
]

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getWilayah(slug) {
  return WILAYAH.find((w) => w.slug === slug)
}
