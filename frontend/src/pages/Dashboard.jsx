import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Minus,
  PieChart,
  PiggyBank,
  Plus,
  ReceiptText,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import FinancialHealth from '../components/FinancialHealth'
import IncomeExpenseChart from '../components/IncomeExpenseChart'
import KpiCard from '../components/KpiCard'
import LoadingState from '../components/LoadingState'
import MonthlyBudgetCard from '../components/MonthlyBudgetCard'
import MonthYearPicker from '../components/MonthYearPicker'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import QuickAction from '../components/QuickAction'
import Reveal from '../components/Reveal'
import SpendingChart from '../components/SpendingChart'
import TransactionForm from '../components/TransactionForm'
import { useAuth } from '../context/AuthContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate, MONTH_NAMES } from '../utils/format'
import { trendFrom } from '../utils/trends'

function budgetStatusMeta(percentUsed) {
  if (percentUsed >= 100) return { label: 'Budget exceeded', tone: 'danger', icon: AlertTriangle }
  if (percentUsed >= 80) return { label: 'Approaching limit', tone: 'warning', icon: AlertTriangle }
  return { label: 'On track', tone: 'success', icon: CheckCircle2 }
}

export default function Dashboard() {
  const { user } = useAuth()
  const formatCurrency = useFormatCurrency()
  const [data, setData] = useState(null)
  const [comparison, setComparison] = useState(null)
  // Always "this month" - feeds the Insights section, which is worded in
  // terms of the current month regardless of what period the chart shows.
  const [distribution, setDistribution] = useState(null)
  const [distributionTotal, setDistributionTotal] = useState(0)
  // Last month's distribution, fetched lazily only once the selector is used.
  const [lastMonthDistribution, setLastMonthDistribution] = useState(null)
  const [lastMonthTotal, setLastMonthTotal] = useState(0)
  const [chartPeriod, setChartPeriod] = useState('this')
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState('expense')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const now = new Date()
  // The month/year the dashboard snapshot (balance, budget status) is scoped
  // to - defaults to the real current month, changeable via MonthYearPicker.
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const isCurrentMonth = viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear()

  const loadLastMonthDistribution = async () => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    try {
      const res = await reportsApi.expenseDistribution({ month: d.getMonth() + 1, year: d.getFullYear() })
      setLastMonthDistribution(res.data.distribution)
      setLastMonthTotal(res.data.total)
    } catch {
      setLastMonthDistribution([])
      setLastMonthTotal(0)
    }
  }

  const load = async ({ showLoading = true, month = viewMonth, year = viewYear } = {}) => {
    if (showLoading) setLoading(true)
    setError(false)
    try {
      const [dashRes, compRes, distRes] = await Promise.all([
        reportsApi.dashboard({ month, year }),
        reportsApi.monthlyComparison(),
        reportsApi.expenseDistribution({ month: now.getMonth() + 1, year: now.getFullYear() }),
      ])
      setData(dashRes.data)
      setComparison(compRes.data.data)
      setDistribution(distRes.data.distribution)
      setDistributionTotal(distRes.data.total)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChartPeriodChange = (p) => {
    setChartPeriod(p)
    if (p === 'last' && lastMonthDistribution === null) loadLastMonthDistribution()
  }

  const handleViewMonthChange = ({ month, year }) => {
    setViewMonth(month)
    setViewYear(year)
    load({ month, year })
  }

  const chartDistribution = chartPeriod === 'last' ? lastMonthDistribution : distribution
  const chartTotal = chartPeriod === 'last' ? lastMonthTotal : distributionTotal

  const openForm = (type) => {
    setFormType(type)
    setFormOpen(true)
  }

  const handleSaved = (newAlert) => {
    setFormOpen(false)
    if (newAlert) setAlert(newAlert)
    load({ showLoading: false })
  }

  // Trend badges compare against the live rolling 6-month window, so they
  // only make sense while viewing the real current month.
  const incomeTrend = isCurrentMonth && comparison?.length >= 2 ? trendFrom(comparison[5].income, comparison[4].income) : null
  const expenseTrend = isCurrentMonth && comparison?.length >= 2 ? trendFrom(comparison[5].expense, comparison[4].expense) : null
  const netTrend =
    isCurrentMonth && comparison?.length >= 2
      ? trendFrom(comparison[5].income - comparison[5].expense, comparison[4].income - comparison[4].expense)
      : null

  const totalBudgetLimit = data ? data.budgetStatus.reduce((s, b) => s + b.amountLimit, 0) : 0
  const totalBudgetSpent = data ? data.budgetStatus.reduce((s, b) => s + b.spent, 0) : 0
  const budgetAvailable = Math.max(0, totalBudgetLimit - totalBudgetSpent)
  const budgetPercentUsed = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 1000) / 10 : 0

  // Plain data (not JSX) so the same real insights can render on either the
  // light or the dark Financial Insights card treatment.
  const insights = []
  if (distribution?.length > 0) {
    const top = [...distribution].sort((a, b) => b.amount - a.amount)[0]
    insights.push({
      key: 'top',
      icon: TrendingDown,
      text: (
        <>
          Your biggest expense is <span className="font-semibold">{top.category}</span> ({top.percentage}% of total spending).
        </>
      ),
    })
  }
  if (expenseTrend) {
    insights.push({
      key: 'pattern',
      icon: expenseTrend.up ? TrendingUp : Sparkles,
      text: (
        <>
          You're spending <span className="font-semibold">{expenseTrend.value}% {expenseTrend.up ? 'more' : 'less'}</span> than
          last month. {expenseTrend.up ? 'Keep an eye on it.' : 'Keep it up!'}
        </>
      ),
    })
  }
  if (data?.budgetStatus.length > 0) {
    insights.push({
      key: 'budget',
      icon: Wallet,
      text: (
        <>
          You have <span className="font-semibold">{formatCurrency(budgetAvailable)}</span> remaining in your monthly budget.
        </>
      ),
    })
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋`}
        description={`Here's your financial snapshot for ${MONTH_NAMES[viewMonth - 1]} ${viewYear}.`}
        actions={
          <>
            <MonthYearPicker month={viewMonth} year={viewYear} onChange={handleViewMonthChange} />
            <Button variant="success" leftIcon={Plus} onClick={() => openForm('income')}>
              Add Income
            </Button>
            <Button variant="danger" leftIcon={Minus} onClick={() => openForm('expense')}>
              Add Expense
            </Button>
          </>
        }
      />

      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />

      {loading ? (
        <LoadingState variant="cards" cards={9} cols={3} />
      ) : error ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">Something went wrong</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">We couldn't load your financial data.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => load()}>
            Try Again
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Row 1: four KPI tiles - real balance/income/expense/budget figures, each with a real trend and sparkline built from the actual 6-month comparison data. */}
          <Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                icon={Wallet}
                label="Total Balance"
                amount={data.balance.net}
                trend={netTrend}
                sparklineValues={comparison?.map((m) => m.income - m.expense)}
                tone="hero"
                maskable
              />
              <KpiCard
                icon={TrendingUp}
                label="Income"
                amount={data.balance.totalIncome}
                trend={incomeTrend}
                favorableWhenUp
                sparklineValues={comparison?.map((m) => m.income)}
                tone="success"
              />
              <KpiCard
                icon={TrendingDown}
                label="Expenses"
                amount={data.balance.totalExpense}
                trend={expenseTrend}
                favorableWhenUp={false}
                sparklineValues={comparison?.map((m) => m.expense)}
                tone="danger"
              />
              <KpiCard
                icon={Target}
                label="Budgets"
                amount={budgetAvailable}
                subtitle={`${budgetPercentUsed}% of total budget used`}
                progressPercent={budgetPercentUsed}
                tone="brand"
              />
            </div>
          </Reveal>

          {/* Row 2: budget summary, quick actions, spending mix. */}
          <Reveal delay={80}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <MonthlyBudgetCard budgetStatus={data.budgetStatus} />

              <Card>
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <QuickAction icon={PiggyBank} label="Create Budget" to="/budgets" tone="brand" />
                  <QuickAction icon={CreditCard} label="Make a Payment" to="/pay" tone="success" />
                  <QuickAction icon={PieChart} label="View Reports" to="/reports" tone="warning" />
                  <QuickAction icon={ReceiptText} label="All Transactions" to="/transactions" tone="neutral" />
                </div>
              </Card>

              <SpendingChart
                distribution={chartDistribution}
                total={chartTotal}
                period={chartPeriod}
                onPeriodChange={handleChartPeriodChange}
              />
            </div>
          </Reveal>

          {/* Row 3: recent activity as a compact real transaction table, plus financial health. */}
          <Reveal delay={160}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card padded={false}>
                <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
                  <Link
                    to="/transactions"
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    View all →
                  </Link>
                </div>
                {data.recentTransactions.length === 0 ? (
                  <EmptyState
                    icon={ReceiptText}
                    title="Start tracking your money"
                    description="Add your first income or expense to begin seeing your financial activity here."
                    action={
                      <Button variant="secondary" size="sm" onClick={() => openForm('expense')}>
                        Add Transaction
                      </Button>
                    }
                  />
                ) : (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        <tr>
                          <th scope="col" className="px-5 pb-2 sm:px-6">Date</th>
                          <th scope="col" className="px-2 pb-2">Description</th>
                          <th scope="col" className="hidden px-2 pb-2 sm:table-cell">Category</th>
                          <th scope="col" className="px-2 pb-2 text-right sm:px-5">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.recentTransactions.map((t) => {
                          const isIncome = t.type === 'income'
                          const CategoryIcon = getCategoryIcon(t.category.name)
                          const color = getCategoryColor(t.category.name)
                          return (
                            <tr key={t.id}>
                              <td className="whitespace-nowrap px-5 py-3 text-slate-500 dark:text-slate-400 sm:px-6">
                                {formatDate(t.transactionDate)}
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex items-center gap-2.5">
                                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`} aria-hidden="true">
                                    <CategoryIcon size={14} />
                                  </span>
                                  <span className="max-w-[140px] truncate font-medium text-slate-800 dark:text-slate-100">
                                    {t.description || t.category.name}
                                  </span>
                                </div>
                              </td>
                              <td className="hidden whitespace-nowrap px-2 py-3 text-slate-500 dark:text-slate-400 sm:table-cell">
                                {t.category.name}
                              </td>
                              <td
                                className={`whitespace-nowrap px-2 py-3 text-right font-semibold tabular-nums sm:px-5 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                              >
                                {isIncome ? '+' : '-'}
                                {formatCurrency(t.amount)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              <FinancialHealth
                totalIncome={data.balance.totalIncome}
                totalExpense={data.balance.totalExpense}
                budgetStatus={data.budgetStatus}
              />
            </div>
          </Reveal>

          {/* Row 4: 6-month trend and the detailed per-category budget breakdown. */}
          <Reveal delay={240}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <IncomeExpenseChart data={comparison} title="Income vs Expenses (6 months)" />

              <Card padded={false}>
                <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Budget Status</h2>
                  <Link to="/budgets" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    Manage
                  </Link>
                </div>
                {data.budgetStatus.length === 0 ? (
                  <EmptyState
                    icon={PiggyBank}
                    decorative
                    title="No budgets set yet"
                    description="Create category budgets to understand and control your spending."
                    action={
                      <Link to="/budgets" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                        Create Your First Budget →
                      </Link>
                    }
                  />
                ) : (
                  <div className="space-y-4 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                    {data.budgetStatus.map((b) => {
                      const status = budgetStatusMeta(b.percentUsed)
                      const remaining = b.amountLimit - b.spent
                      return (
                        <div key={b.categoryId}>
                          <div className="mb-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{b.categoryName}</span>
                            <Badge tone={status.tone} icon={status.icon}>
                              {status.label}
                            </Badge>
                          </div>
                          <ProgressBar percent={b.percentUsed} tone={status.tone} label={`${b.categoryName} budget usage`} />
                          <div className="mt-1 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                            <span>
                              {formatCurrency(b.spent)} of {formatCurrency(b.amountLimit)}
                            </span>
                            <span className={remaining < 0 ? 'font-medium text-rose-600 dark:text-rose-400' : ''}>
                              {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>
          </Reveal>

          {/* Row 5: financial insights, styled as a dark highlight card. */}
          <Reveal delay={320}>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" aria-hidden="true" />
                <h2 className="font-semibold text-white">Financial Insights</h2>
              </div>
              {insights.length === 0 ? (
                <p className="text-sm text-slate-400">Add transactions to generate useful spending insights.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {insights.map((insight) => (
                    <div key={insight.key} className="flex items-start gap-3 rounded-xl bg-white/5 p-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300" aria-hidden="true">
                        <insight.icon size={15} />
                      </span>
                      <p className="text-sm text-slate-200">{insight.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      )}

      {formOpen && <TransactionForm initialType={formType} onClose={() => setFormOpen(false)} onSaved={handleSaved} />}
    </div>
  )
}
