import { ReceiptText, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Reveal from './Reveal'
import StatCard from './StatCard'

/** Real aggregate for the current filter scope (from the backend, not summed from the current page). */
export default function TransactionSummary({ summary }) {
  const formatCurrency = useFormatCurrency()

  if (!summary) return null

  const cards = [
    { label: 'Total Income', value: formatCurrency(summary.totalIncome), icon: TrendingUp, tone: 'success' },
    { label: 'Total Expenses', value: formatCurrency(summary.totalExpense), icon: TrendingDown, tone: 'danger' },
    { label: 'Net Cash Flow', value: formatCurrency(summary.net), icon: Wallet, tone: summary.net >= 0 ? 'brand' : 'danger' },
    { label: 'Transactions', value: String(summary.count), icon: ReceiptText, tone: 'neutral' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <Reveal key={c.label} delay={i * 60}>
          <StatCard label={c.label} value={c.value} icon={c.icon} tone={c.tone} />
        </Reveal>
      ))}
    </div>
  )
}
