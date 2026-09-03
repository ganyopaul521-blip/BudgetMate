import { ChevronDown, PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import Card from './Card'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

const COLORS = ['#4f46e5', '#e11d48', '#059669', '#d97706', '#0891b2', '#7c3aed', '#db2777', '#65a30d', '#2563eb', '#ea580c']

/**
 * Donut chart of spending by category, with a real total in the center.
 * `distribution`/`total` come from GET /reports/expense-distribution
 * (distribution null while loading). When `period`/`onPeriodChange` are
 * given, renders a This Month / Last Month selector that the caller
 * refetches expense-distribution for - no client-side fabrication.
 */
export default function SpendingChart({ distribution, total, title = 'Spending by Category', period, onPeriodChange }) {
  const formatCurrency = useFormatCurrency()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const tooltipContentStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 13,
    color: isDark ? '#e2e8f0' : '#0f172a',
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        {onPeriodChange && (
          <div className="relative">
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              aria-label="Select period"
              className="appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-2.5 pr-7 text-xs font-medium text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="this">This Month</option>
              <option value="last">Last Month</option>
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {distribution === null ? (
        <LoadingState variant="page" />
      ) : distribution.length === 0 ? (
        <EmptyState
          icon={PieChartIcon}
          title={period === 'last' ? 'No expenses last month' : 'No expenses this month'}
          description="Add an expense to see your spending breakdown."
        />
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative shrink-0">
            <PieChart width={180} height={180}>
              <Pie
                data={distribution}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {distribution.map((entry, i) => (
                  <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipContentStyle} />
            </PieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Total</span>
              <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white">{formatCurrency(total)}</span>
            </div>
          </div>

          <ul className="w-full min-w-0 space-y-2.5">
            {distribution.map((entry, i) => (
              <li key={entry.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-slate-600 dark:text-slate-300">{entry.category}</span>
                </span>
                <span className="shrink-0 tabular-nums text-slate-400 dark:text-slate-500">{entry.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
