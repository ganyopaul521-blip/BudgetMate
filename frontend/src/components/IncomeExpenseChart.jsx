import { BarChart3 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Card from './Card'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

/** Bar chart of income vs expenses over time. `data` is the array from GET /reports/monthly-comparison (null while loading). */
export default function IncomeExpenseChart({ data, title = 'Income vs Expenses' }) {
  const formatCurrency = useFormatCurrency()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const legendStyle = { color: isDark ? '#cbd5e1' : '#475569', fontSize: 13 }
  const tooltipContentStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 13,
    color: isDark ? '#e2e8f0' : '#0f172a',
  }

  const hasActivity = data?.some((d) => d.income > 0 || d.expense > 0)

  return (
    <Card>
      <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">{title}</h2>
      {data === null ? (
        <LoadingState variant="page" />
      ) : !hasActivity ? (
        <EmptyState icon={BarChart3} title="Nothing to compare yet" description="Once you log income and expenses, you'll see how they trend here." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipContentStyle} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey="income" name="Income" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#e11d48" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
