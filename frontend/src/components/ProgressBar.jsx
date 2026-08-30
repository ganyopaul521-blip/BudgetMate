const TONE_CLASSES = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  brand: 'bg-indigo-600',
}

/** Generic progress bar. Pass `tone` directly, or `percent` + thresholds to auto-derive it. */
export default function ProgressBar({ percent, tone, label, size = 'md', className = '' }) {
  const clamped = Math.min(Math.max(percent ?? 0, 0), 100)
  const resolvedTone = tone || (percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'success')
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={className}>
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${height}`}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${TONE_CLASSES[resolvedTone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
