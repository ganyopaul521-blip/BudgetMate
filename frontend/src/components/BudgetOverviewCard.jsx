import { useFormatCurrency } from '../hooks/useFormatCurrency'

/** Real coverage: total GH₵ committed across this month's budgets, and what share of expense categories have one set. */
export default function BudgetOverviewCard({ totalBudget, percentSet }) {
  const formatCurrency = useFormatCurrency()
  const size = 72
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(percentSet, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Monthly Budget Overview</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">{formatCurrency(totalBudget)}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Total Budget Set</p>
      </div>

      <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(clamped)}% of your categories have a budget set`}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-slate-100 dark:stroke-slate-800" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-indigo-600 dark:stroke-indigo-400"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{Math.round(clamped)}%</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Set</span>
        </div>
      </div>
    </div>
  )
}
