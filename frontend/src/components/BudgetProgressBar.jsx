import { formatCurrency } from '../utils/format'

export default function BudgetProgressBar({ categoryName, spent, amountLimit, percentUsed }) {
  const barColor = percentUsed >= 100 ? 'bg-red-500' : percentUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
  const width = Math.min(percentUsed, 100)

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{categoryName}</span>
        <span className="text-slate-500">
          {formatCurrency(spent)} / {formatCurrency(amountLimit)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${width}%` }} />
      </div>
      <p className="mt-0.5 text-right text-xs text-slate-400">{percentUsed}% used</p>
    </div>
  )
}
