import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Badge from './Badge'
import Card from './Card'
import ProgressBar from './ProgressBar'

export default function BudgetCard({ categoryName, spent, amountLimit, percentUsed, children }) {
  const formatCurrency = useFormatCurrency()
  const level = percentUsed >= 100 ? 'danger' : percentUsed >= 80 ? 'warning' : 'success'
  const remaining = amountLimit - spent

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">{categoryName}</h3>
        {level === 'danger' && (
          <Badge tone="danger" icon={AlertTriangle}>
            Exceeded
          </Badge>
        )}
        {level === 'warning' && (
          <Badge tone="warning" icon={AlertTriangle}>
            Near limit
          </Badge>
        )}
        {level === 'success' && (
          <Badge tone="success" icon={CheckCircle2}>
            On track
          </Badge>
        )}
      </div>

      <ProgressBar percent={percentUsed} tone={level} label={`${categoryName} budget usage`} />

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {formatCurrency(spent)} <span className="text-slate-400 dark:text-slate-500">of {formatCurrency(amountLimit)}</span>
        </span>
        <span
          className={`font-semibold tabular-nums ${remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}
        >
          {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
        </span>
      </div>

      {children}
    </Card>
  )
}
