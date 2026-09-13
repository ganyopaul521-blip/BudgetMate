import { useFormatCurrency } from '../hooks/useFormatCurrency'

/** Real total GH₵ committed across this month's budgets, and what share of it has actually been spent. */
export default function BudgetOverviewCard({ totalBudget, percentUsed }) {
  const formatCurrency = useFormatCurrency()
  const size = 68
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(percentUsed, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-5 py-3.5 text-white shadow-lg">
      <div className="animate-glow-pulse pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />

      <div className="relative">
        <p className="text-xs font-medium text-indigo-100">Monthly Budget Overview</p>
        <p className="mt-0.5 text-xl font-bold tabular-nums">{formatCurrency(totalBudget)}</p>
        <p className="text-[11px] text-indigo-200">Total Budget Set</p>
      </div>

      <div
        className="relative ml-auto shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${Math.round(clamped)}% of your monthly budget has been used`}
      >
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-white/20" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-white"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold tabular-nums">{Math.round(clamped)}%</span>
          <span className="text-[9px] text-indigo-100">Used</span>
        </div>
      </div>
    </div>
  )
}
