const TONES = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-rose-100 text-rose-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-indigo-100 text-indigo-700',
}

export default function Badge({ tone = 'neutral', children, className = '', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}
