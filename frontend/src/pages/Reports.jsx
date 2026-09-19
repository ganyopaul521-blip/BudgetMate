import { PieChart as PieChartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { categoriesApi, reportsApi } from '../api/endpoints'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import Select from '../components/Select'
import StatCard from '../components/StatCard'
import { useTheme } from '../context/ThemeContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { MONTH_NAMES } from '../utils/format'

const COLORS = ['#4f46e5', '#e11d48', '#059669', '#d97706', '#0891b2', '#7c3aed', '#db2777', '#65a30d', '#2563eb', '#ea580c']

const now = new Date()

export default function Reports() {
  const formatCurrency = useFormatCurrency()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#334155' : '#e2e8f0'
  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const tooltipContentStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 13,
    color: isDark ? '#e2e8f0' : '#0f172a',
  }
  const legendStyle = { color: isDark ? '#cbd5e1' : '#475569', fontSize: 13 }

  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [distribution, setDistribution] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [trendCategoryId, setTrendCategoryId] = useState('')
  const [trend, setTrend] = useState(null)

  useEffect(() => {
    categoriesApi.list('expense').then((res) => {
      setCategories(res.data.categories)
      if (res.data.categories.length > 0) setTrendCategoryId(res.data.categories[0].id)
    })
    reportsApi.monthlyComparison().then((res) => setComparison(res.data.data))
  }, [])

  useEffect(() => {
    setDistribution(null)
    setSummary(null)
    reportsApi.expenseDistribution({ month, year }).then((res) => setDistribution(res.data.distribution))
    reportsApi.summary({ month, year }).then((res) => setSummary(res.data))
  }, [month, year])

  useEffect(() => {
    if (trendCategoryId) {
      setTrend(null)
      reportsApi.categoryTrend(trendCategoryId).then((res) => setTrend(res.data.data))
    }
  }, [trendCategoryId])

  return (
    <div className="bm-page bm-page-reports">
      <PageHeader
        title="Reports"
        description="Visualise your spending patterns and trends."
        actions={
          <div className="flex gap-2">
            <Select aria-label="Select month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </Select>
            <Select aria-label="Select year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      {!summary ? (
        <LoadingState variant="stats" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Income" value={formatCurrency(summary.totalIncome)} tone="success" />
          <StatCard label="Total Expenditure" value={formatCurrency(summary.totalExpense)} tone="danger" />
          <StatCard label="Net Balance" value={formatCurrency(summary.netBalance)} tone="brand" />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Expenditure Distribution</h2>
          {distribution === null ? (
            <LoadingState variant="page" />
          ) : distribution.length === 0 ? (
            <EmptyState icon={PieChartIcon} title="No expenses this period" description="Add expenses to see the breakdown." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
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

        <Card>
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Income vs Expenditure (6 months)</h2>
          {comparison === null ? (
            <LoadingState variant="page" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} />
                <YAxis tick={{ fontSize: 12, fill: tickColor }} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipContentStyle} />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="income" name="Income" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenditure" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900 dark:text-white">Category Spending Trend (6 months)</h2>
            <Select
              aria-label="Select category for trend"
              value={trendCategoryId}
              onChange={(e) => setTrendCategoryId(e.target.value)}
              className="w-auto"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          {trend === null ? (
            <LoadingState variant="page" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} />
                <YAxis tick={{ fontSize: 12, fill: tickColor }} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipContentStyle} />
                <Line type="monotone" dataKey="amount" name="Spending" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {summary?.topCategories?.length > 0 && (
          <Card className="lg:col-span-2">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Top Spending Categories</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {summary.topCategories.map((c) => (
                <div key={c.category} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{c.category}</span>
                  <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
