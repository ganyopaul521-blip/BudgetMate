import Card from './Card'

const TONES = {
  neutral: { icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', value: 'text-slate-900 dark:text-white' },
  success: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    value: 'text-emerald-600 dark:text-emerald-400',
  },
  danger: {
    icon: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    value: 'text-rose-600 dark:text-rose-400',
  },
  brand: {
    icon: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    value: 'text-slate-900 dark:text-white',
  },
}

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', sub }) {
  const t = TONES[tone]
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`mt-1.5 truncate text-2xl font-bold tabular-nums ${t.value}`}>{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`} aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
    </Card>
  )
}
