import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Minus,
  PieChart,
  PiggyBank,
  Plus,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import Badge from '../components/Badge'
import BalanceHero from '../components/BalanceHero'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import FinancialHealth from '../components/FinancialHealth'
import IncomeExpenseChart from '../components/IncomeExpenseChart'
import InsightCard from '../components/InsightCard'
import LoadingState from '../components/LoadingState'
import MonthlyBudgetCard from '../components/MonthlyBudgetCard'
import MonthYearPicker from '../components/MonthYearPicker'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import QuickAction from '../components/QuickAction'
import SpendingChart from '../components/SpendingChart'
import TransactionCard from '../components/TransactionCard'
import TransactionForm from '../components/TransactionForm'
import { useAuth } from '../context/AuthContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { MONTH_NAMES } from '../utils/format'

function budgetStatusMeta(percentUsed) {
  if (percentUsed >= 100) return { label: 'Budget exceeded', tone: 'danger', icon: AlertTriangle }
  if (percentUsed >= 80) return { label: 'Approaching limit', tone: 'warning', icon: AlertTriangle }
  return { label: 'On track', tone: 'success', icon: CheckCircle2 }
}

// Real month-over-month % change - returns null (not shown) rather than a
// misleading 0%/Infinity% when there's no prior-month figure to compare against.
function trendFrom(current, previous) {
  if (!previous) return null
  const change = ((current - previous) / previous) * 100
  return { value: Math.round(Math.abs(change) * 10) / 10, up: change >= 0 }
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

  const insights = []
  if (distribution?.length > 0) {
    const top = [...distribution].sort((a, b) => b.amount - a.amount)[0]
    insights.push(
      <InsightCard key="top" icon={TrendingDown} label="Top Spending Category">
        <span className="font-semibold text-slate-900 dark:text-white">{top.category}</span>
        <span className="text-slate-500 dark:text-slate-400"> — {formatCurrency(top.amount)} this month</span>
      </InsightCard>
    )
  }
  if (data?.budgetStatus.length > 0) {
    const avgUsed = Math.round(data.budgetStatus.reduce((s, b) => s + b.percentUsed, 0) / data.budgetStatus.length)
    insights.push(
      <InsightCard key="budget" icon={PiggyBank} label="Budget Status">
        You're using <span className="font-semibold text-slate-900 dark:text-white">{avgUsed}%</span> of your planned budget on
        average.
      </InsightCard>
    )
  }
  if (expenseTrend) {
    insights.push(
      <InsightCard key="pattern" icon={expenseTrend.up ? TrendingUp : TrendingDown} label="Spending Pattern">
        Your spending is{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{expenseTrend.up ? 'higher' : 'lower'}</span> than last
        month ({expenseTrend.value}% {expenseTrend.up ? 'more' : 'less'}).
      </InsightCard>
    )
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
        <div className="space-y-6">
          <LoadingState variant="cards" cards={3} />
          <LoadingState variant="cards" />
        </div>
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
          {/* Hero row: balance + monthly trend, budget + spending mix, quick actions + recent activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <BalanceHero
              balance={data.balance}
              months={comparison || []}
              incomeTrend={incomeTrend}
              expenseTrend={expenseTrend}
              periodLabel={isCurrentMonth ? 'This Month' : `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}
            />

            <div className="space-y-6">
              <MonthlyBudgetCard budgetStatus={data.budgetStatus} />
              <SpendingChart
                distribution={chartDistribution}
                total={chartTotal}
                period={chartPeriod}
                onPeriodChange={handleChartPeriodChange}
              />
            </div>

            <div className="space-y-6">
              <Card>
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <QuickAction icon={PiggyBank} label="Create Budget" to="/budgets" tone="brand" />
                  <QuickAction icon={CreditCard} label="Make a Payment" to="/pay" tone="success" />
                  <QuickAction icon={PieChart} label="View Reports" to="/reports" tone="warning" />
                  <QuickAction icon={ReceiptText} label="All Transactions" to="/transactions" tone="neutral" />
                </div>
              </Card>

              <Card padded={false}>
                <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
                  <Link to="/transactions" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    View all
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
                  <div className="mt-2">
                    {data.recentTransactions.map((t) => (
                      <TransactionCard key={t.id} transaction={t} />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Details: financial health, full income/expense trend, per-category budgets, insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FinancialHealth
              totalIncome={data.balance.totalIncome}
              totalExpense={data.balance.totalExpense}
              budgetStatus={data.budgetStatus}
            />
            <IncomeExpenseChart data={comparison} title="Income vs Expenses (6 months)" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  title="No budgets set yet"
                  description="Create category budgets to understand and control your spending."
                  action={
                    <Link
                      to="/budgets"
                      className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
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

            <Card>
              <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Your Financial Insights</h2>
              {insights.length === 0 ? (
                <EmptyState
                  icon={ReceiptText}
                  title="Your insights are waiting"
                  description="Add transactions to generate useful spending insights."
                />
              ) : (
                <div className="space-y-4">{insights}</div>
              )}
            </Card>
          </div>
        </div>
      )}

      {formOpen && <TransactionForm initialType={formType} onClose={() => setFormOpen(false)} onSaved={handleSaved} />}
    </div>
  )
}
