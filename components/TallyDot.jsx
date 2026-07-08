const SEVERITY_MAP = {
  critical: { color: 'bg-tally-critical', label: 'Kritis' },
  warning: { color: 'bg-tally-warning', label: 'Perlu Perhatian' },
  tip: { color: 'bg-tally-ok', label: 'Tips' },
}

// Borrows real broadcast-switcher tally convention: red = program/on-air issue,
// amber = caution, green = preview/resolved-tip. Encodes actual severity.
export default function TallyDot({ severity = 'tip', showLabel = false, className = '' }) {
  const meta = SEVERITY_MAP[severity] || SEVERITY_MAP.tip
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`h-2 w-2 rounded-full ${meta.color} shrink-0`} aria-hidden="true" />
      {showLabel && (
        <span className="text-xs font-mono uppercase tracking-wide text-muted-light dark:text-muted-dark">
          {meta.label}
        </span>
      )}
    </span>
  )
}

export { SEVERITY_MAP }
