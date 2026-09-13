import { CreditCard, Lightbulb, ListChecks, PieChart, Search, Sparkles, Target, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { budgetsApi, categoriesApi } from '../api/endpoints'
import BudgetCard from '../components/BudgetCard'
import BudgetOverviewCard from '../components/BudgetOverviewCard'
import LoadingState from '../components/LoadingState'
import MonthYearPicker from '../components/MonthYearPicker'
import PageHeader from '../components/PageHeader'
import QuickAction from '../components/QuickAction'
import Select from '../components/Select'
import { useFormatCurrency } from '../hooks/useFormatCurrency'

const now = new Date()

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'on-track', label: 'On track' },
  { value: 'near-limit', label: 'Near limit' },
  { value: 'exceeded', label: 'Exceeded' },
  { value: 'no-budget', label: 'No budget set' },
]

function statusOf(budget) {
  if (!budget) return 'no-budget'
  if (budget.percentUsed >= 100) return 'exceeded'
  if (budget.percentUsed >= 80) return 'near-limit'
  return 'on-track'
}

export default function Budgets() {
  const formatCurrency = useFormatCurrency()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const [catRes, budRes] = await Promise.all([categoriesApi.list('expense'), budgetsApi.list({ month, year })])
    setCategories(catRes.data.categories)
    setBudgets(budRes.data.budgets)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year])

  const budgetFor = (categoryId) => budgets.find((b) => b.categoryId === categoryId)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amountLimit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0
  const available = Math.max(0, totalBudget - totalSpent)

  const filteredCategories = categories.filter((cat) => {
    if (search && !cat.name.toLowerCase().includes(search.trim().toLowerCase())) return false
    if (statusFilter !== 'all' && statusOf(budgetFor(cat.id)) !== statusFilter) return false
    return true
  })

  // Real insights computed from this month's actual budgets - not AI-generated,
  // just honest arithmetic over real data. Omitted entirely when there's
  // nothing to say rather than inventing filler.
  const insights = []
  if (budgets.length > 0) {
    const mostExceeded = [...budgets].filter((b) => b.percentUsed > 100).sort((a, b) => b.percentUsed - a.percentUsed)[0]
    if (mostExceeded) {
      const cat = categories.find((c) => c.id === mostExceeded.categoryId)
      insights.push({
        key: 'exceeded',
        icon: TrendingUp,
        text: (
          <>
            Your <span className="font-semibold">{cat?.name}</span> budget has been exceeded by{' '}
            <span className="font-semibold">{formatCurrency(mostExceeded.spent - mostExceeded.amountLimit)}</span>.
          </>
        ),
      })
    }

    const biggest = [...budgets].sort((a, b) => b.spent - a.spent)[0]
    if (biggest?.spent > 0) {
      const cat = categories.find((c) => c.id === biggest.categoryId)
      const share = totalSpent > 0 ? Math.round((biggest.spent / totalSpent) * 1000) / 10 : 0
      insights.push({
        key: 'biggest',
        icon: PieChart,
        text: (
          <>
            <span className="font-semibold">{cat?.name}</span> is your biggest expense ({share}% of your budgeted spending).
          </>
        ),
      })
    }

    insights.push({
      key: 'remaining',
      icon: Wallet,
      text: (
        <>
          You have <span className="font-semibold">{formatCurrency(available)}</span> remaining across your monthly budgets.
        </>
      ),
    })

    const unused = budgets.find((b) => b.spent === 0)
    if (unused) {
      const cat = categories.find((c) => c.id === unused.categoryId)
      insights.push({
        key: 'unused',
        icon: Sparkles,
        text: (
          <>
            <span className="font-semibold">{cat?.name}</span> hasn't been used this month.
          </>
        ),
      })
    }
  }

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Set a monthly spending limit for each category and take control of your finances."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <MonthYearPicker month={month} year={year} onChange={({ month: m, year: y }) => { setMonth(m); setYear(y) }} />
            {!loading && <BudgetOverviewCard totalBudget={totalBudget} percentUsed={percentUsed} />}
          </div>
        }
      />

      {loading ? (
        <LoadingState variant="cards" cards={6} cols={3} />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  aria-label="Search budget categories"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
                />
              </div>
              <Select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sm:w-48"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            {filteredCategories.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
                No categories match your search/filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCategories.map((cat) => {
                  const budget = budgetFor(cat.id)
                  return (
                    <BudgetCard
                      key={cat.id}
                      categoryId={cat.id}
                      categoryName={cat.name}
                      budgetId={budget?.id}
                      spent={budget?.spent}
                      amountLimit={budget?.amountLimit}
                      percentUsed={budget?.percentUsed}
                      month={month}
                      year={year}
                      onChanged={load}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Target size={16} className="text-indigo-500" aria-hidden="true" />
                Quick Actions
              </h2>
              <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">Manage your finances with ease</p>
              <div className="space-y-2.5">
                <QuickAction icon={CreditCard} label="Make a Payment" to="/pay" tone="success" />
                <QuickAction icon={PieChart} label="View Reports" to="/reports" tone="warning" />
                <QuickAction icon={ListChecks} label="All Transactions" to="/transactions" tone="neutral" />
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-5 shadow-sm">
              <h2 className="mb-1 flex items-center gap-2 font-semibold text-white">
                <Lightbulb size={16} className="text-indigo-400" aria-hidden="true" />
                Smart Insights
              </h2>
              <p className="mb-4 text-xs text-slate-400">Real insights from your budget data</p>
              {insights.length === 0 ? (
                <p className="text-sm text-slate-400">Set a budget to start seeing insights here.</p>
              ) : (
                <div className="space-y-2.5">
                  {insights.map((insight) => (
                    <div key={insight.key} className="flex items-start gap-2.5 rounded-xl bg-white/5 p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300" aria-hidden="true">
                        <insight.icon size={13} />
                      </span>
                      <p className="text-sm text-slate-200">{insight.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
