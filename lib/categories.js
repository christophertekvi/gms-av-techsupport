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
