import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import StatCard from './StatCard'

/** Real aggregate for the current filter scope (from the backend, not summed from the current page). */
export default function TransactionSummary({ summary }) {
  const formatCurrency = useFormatCurrency()

  if (!summary) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Income" value={formatCurrency(summary.totalIncome)} icon={TrendingUp} tone="success" />
      <StatCard label="Total Expenses" value={formatCurrency(summary.totalExpense)} icon={TrendingDown} tone="danger" />
      <StatCard
        label="Net Cash Flow"
        value={formatCurrency(summary.net)}
        icon={Wallet}
        tone={summary.net >= 0 ? 'brand' : 'danger'}
      />
      <StatCard label="Transactions" value={String(summary.count)} icon={Receipt} tone="neutral" />
    </div>
  )
}
