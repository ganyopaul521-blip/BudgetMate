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
import { formatCurrency, MONTH_NAMES } from '../utils/format'

const COLORS = ['#059669', '#dc2626', '#d97706', '#2563eb', '#7c3aed', '#db2777', '#0891b2', '#65a30d', '#ea580c', '#4f46e5']

const now = new Date()

export default function Reports() {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [distribution, setDistribution] = useState([])
  const [comparison, setComparison] = useState([])
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [trendCategoryId, setTrendCategoryId] = useState('')
  const [trend, setTrend] = useState([])

  useEffect(() => {
    categoriesApi.list('expense').then((res) => {
      setCategories(res.data.categories)
      if (res.data.categories.length > 0) setTrendCategoryId(res.data.categories[0].id)
    })
    reportsApi.monthlyComparison().then((res) => setComparison(res.data.data))
  }, [])

  useEffect(() => {
    reportsApi.expenseDistribution({ month, year }).then((res) => setDistribution(res.data.distribution))
    reportsApi.summary({ month, year }).then((res) => setSummary(res.data))
  }, [month, year])

  useEffect(() => {
    if (trendCategoryId) {
      reportsApi.categoryTrend(trendCategoryId).then((res) => setTrend(res.data.data))
    }
  }, [trendCategoryId])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <div className="flex gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Income</p>
            <p className="mt-1 text-xl font-bold text-emerald-600">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Expenditure</p>
            <p className="mt-1 text-xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Net Balance</p>
            <p className="mt-1 text-xl font-bold text-slate-800">{formatCurrency(summary.netBalance)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Expenditure Distribution</h2>
          {distribution.length === 0 ? (
            <p className="text-sm text-slate-400">No expenses recorded for this period.</p>
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
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Income vs Expenditure (6 months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenditure" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-800">Category Spending Trend (6 months)</h2>
            <select
              value={trendCategoryId}
              onChange={(e) => setTrendCategoryId(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="amount" name="Spending" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {summary?.topCategories?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-3 font-semibold text-slate-800">Top Spending Categories</h2>
            <div className="divide-y divide-slate-100">
              {summary.topCategories.map((c) => (
                <div key={c.category} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-600">{c.category}</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
