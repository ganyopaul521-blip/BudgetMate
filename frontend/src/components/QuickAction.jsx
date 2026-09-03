import { Link } from 'react-router-dom'

const TONES = {
  brand: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  danger: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export default function QuickAction({ icon: Icon, label, to, onClick, tone = 'brand' }) {
  const Component = to ? Link : 'button'

  return (
    <Component
      to={to}
      onClick={onClick}
      type={to ? undefined : 'button'}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`} aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    </Component>
  )
}
