import { PiggyBank } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Button from './Button'
import Card from './Card'
import EmptyState from './EmptyState'
import ProgressBar from './ProgressBar'

/** Aggregate spent/available across all of this month's real budgets - not a single category, the overall picture. */
export default function MonthlyBudgetCard({ budgetStatus }) {
  const formatCurrency = useFormatCurrency()

  if (budgetStatus.length === 0) {
    return (
      <Card>
        <h2 className="mb-1 font-semibold text-slate-900 dark:text-white">Monthly Budget</h2>
        <EmptyState
          icon={PiggyBank}
          decorative
          title="No budgets set yet"
          description="Set a limit per category to see your overall monthly budget here."
          action={
            <Button as={Link} to="/budgets" variant="secondary" size="sm">
              Set a budget
            </Button>
          }
        />
      </Card>
    )
  }

  const totalSpent = budgetStatus.reduce((sum, b) => sum + b.spent, 0)
  const totalLimit = budgetStatus.reduce((sum, b) => sum + b.amountLimit, 0)
  const available = Math.max(0, totalLimit - totalSpent)
  const percentUsed = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 1000) / 10 : 0
  const tone = percentUsed >= 100 ? 'danger' : percentUsed >= 80 ? 'warning' : 'brand'

  // Same thresholds as the detailed per-category Budget Status card, so the
  // two views of the same real budgetStatus data never disagree.
  const onTrack = budgetStatus.filter((b) => b.percentUsed < 80).length
  const watchClosely = budgetStatus.filter((b) => b.percentUsed >= 80 && b.percentUsed < 100).length
  const overBudget = budgetStatus.filter((b) => b.percentUsed >= 100).length
  const categoryWord = (n) => `${n} categor${n === 1 ? 'y' : 'ies'}`

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">Monthly Budget</h2>
        <Link to="/budgets" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Manage
        </Link>
      </div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Spent</p>
          <p className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 dark:text-slate-500">Available</p>
          <p className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatCurrency(available)}</p>
        </div>
      </div>
      <ProgressBar percent={percentUsed} tone={tone} label="Overall monthly budget usage" />
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{percentUsed}% of your combined budget used</p>

      <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            On track
          </span>
          <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{categoryWord(onTrack)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            Watch closely
          </span>
          <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">{categoryWord(watchClosely)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            Over budget
          </span>
          <span className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">{categoryWord(overBudget)}</span>
        </div>
      </div>
    </Card>
  )
}
