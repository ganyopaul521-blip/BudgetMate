import Card from './Card'

const TONES = {
  neutral: { icon: 'bg-slate-100 text-slate-600', value: 'text-slate-900' },
  success: { icon: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-600' },
  danger: { icon: 'bg-rose-100 text-rose-600', value: 'text-rose-600' },
  brand: { icon: 'bg-indigo-100 text-indigo-600', value: 'text-slate-900' },
}

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', sub }) {
  const t = TONES[tone]
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`mt-1.5 truncate text-2xl font-bold tabular-nums ${t.value}`}>{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`} aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
    </Card>
  )
}
