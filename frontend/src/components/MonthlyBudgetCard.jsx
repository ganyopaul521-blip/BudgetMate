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
    </Card>
  )
}
