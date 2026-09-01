import { PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Card from './Card'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

const COLORS = ['#4f46e5', '#e11d48', '#059669', '#d97706', '#0891b2', '#7c3aed', '#db2777', '#65a30d', '#2563eb', '#ea580c']

/** Donut chart of spending by category. `distribution` is the array from GET /reports/expense-distribution (null while loading). */
export default function SpendingChart({ distribution, title = 'Spending by Category' }) {
  const formatCurrency = useFormatCurrency()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const legendStyle = { color: isDark ? '#cbd5e1' : '#475569', fontSize: 13 }
  const tooltipContentStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 13,
    color: isDark ? '#e2e8f0' : '#0f172a',
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">{title}</h2>
      {distribution === null ? (
        <LoadingState variant="page" />
      ) : distribution.length === 0 ? (
        <EmptyState icon={PieChartIcon} title="No expenses this month" description="Add an expense to see your spending breakdown." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={distribution}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              label={({ percentage }) => `${percentage}%`}
            >
              {distribution.map((entry, i) => (
                <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipContentStyle} />
            <Legend wrapperStyle={legendStyle} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
