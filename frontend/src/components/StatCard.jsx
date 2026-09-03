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

const GRADIENTS = {
  gradient: 'from-indigo-600 via-indigo-700 to-violet-800',
  'gradient-danger': 'from-rose-600 via-rose-700 to-rose-900',
}

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', sub }) {
  if (tone === 'gradient' || tone === 'gradient-danger') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${GRADIENTS[tone]} p-5 text-white shadow-lg sm:p-6`}>
        <div
          className="animate-glow-pulse pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-sm font-medium ${tone === 'gradient-danger' ? 'text-rose-100' : 'text-indigo-100'}`}>{label}</p>
            <p className="mt-1.5 truncate text-2xl font-bold tabular-nums text-white">{value}</p>
            {sub && <p className={`mt-1 text-xs ${tone === 'gradient-danger' ? 'text-rose-200' : 'text-indigo-200'}`}>{sub}</p>}
          </div>
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15" aria-hidden="true">
              <Icon size={20} />
            </div>
          )}
        </div>
      </div>
    )
  }

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
