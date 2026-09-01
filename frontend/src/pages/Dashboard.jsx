import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Minus,
  PieChart,
  PiggyBank,
  Plus,
  Receipt,
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
import InsightCard from '../components/InsightCard'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import QuickAction from '../components/QuickAction'
import SpendingChart from '../components/SpendingChart'
import StatCard from '../components/StatCard'
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
  const [distribution, setDistribution] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState('expense')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const now = new Date()

  const load = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true)
    setError(false)
    try {
      const [dashRes, compRes, distRes] = await Promise.all([
        reportsApi.dashboard(),
        reportsApi.monthlyComparison(),
        reportsApi.expenseDistribution({ month: now.getMonth() + 1, year: now.getFullYear() }),
      ])
      setData(dashRes.data)
      setComparison(compRes.data.data)
      setDistribution(distRes.data.distribution)
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

  const openForm = (type) => {
    setFormType(type)
    setFormOpen(true)
  }

  const handleSaved = (newAlert) => {
    setFormOpen(false)
    if (newAlert) setAlert(newAlert)
    load({ showLoading: false })
  }

  const incomeTrend = comparison?.length >= 2 ? trendFrom(comparison[5].income, comparison[4].income) : null
  const expenseTrend = comparison?.length >= 2 ? trendFrom(comparison[5].expense, comparison[4].expense) : null

  const budgetRemaining = data?.budgetStatus?.length
    ? data.budgetStatus.reduce((sum, b) => sum + Math.max(0, b.amountLimit - b.spent), 0)
    : null

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
        description={`Here's your financial snapshot for ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}.`}
        actions={
          <>
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
          <LoadingState variant="stats" />
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
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${budgetRemaining !== null ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            <StatCard
              label="Total Income"
              value={formatCurrency(data.balance.totalIncome)}
              icon={TrendingUp}
              tone="success"
              sub={incomeTrend ? `${incomeTrend.up ? '↑' : '↓'} ${incomeTrend.value}% vs last month` : undefined}
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(data.balance.totalExpense)}
              icon={TrendingDown}
              tone="danger"
              sub={expenseTrend ? `${expenseTrend.up ? '↑' : '↓'} ${expenseTrend.value}% vs last month` : undefined}
            />
            <StatCard
              label="Net Balance"
              value={formatCurrency(data.balance.net)}
              icon={Wallet}
              tone={data.balance.net >= 0 ? 'brand' : 'danger'}
              sub={data.balance.net >= 0 ? 'Positive this month' : 'Spending more than you earn'}
            />
            {budgetRemaining !== null && (
              <StatCard label="Budget Remaining" value={formatCurrency(budgetRemaining)} icon={PiggyBank} tone="brand" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FinancialHealth
              totalIncome={data.balance.totalIncome}
              totalExpense={data.balance.totalExpense}
              budgetStatus={data.budgetStatus}
            />

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
                    <Button as={Link} to="/budgets" variant="secondary" size="sm">
                      Create your first budget
                    </Button>
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SpendingChart distribution={distribution} />
            <IncomeExpenseChart data={comparison} title="Income vs Expenses (6 months)" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card padded={false}>
              <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
                <Link to="/transactions" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  View all
                </Link>
              </div>
              {data.recentTransactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
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

            <Card>
              <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Your Financial Insights</h2>
              {insights.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Your insights are waiting"
                  description="Add transactions to generate useful spending insights."
                />
              ) : (
                <div className="space-y-4">{insights}</div>
              )}
            </Card>
          </div>

          <Card>
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickAction icon={PiggyBank} label="Create Budget" to="/budgets" />
              <QuickAction icon={CreditCard} label="Make a Payment" to="/pay" />
              <QuickAction icon={PieChart} label="View Reports" to="/reports" />
              <QuickAction icon={Receipt} label="All Transactions" to="/transactions" />
            </div>
          </Card>
        </div>
      )}

      {formOpen && <TransactionForm initialType={formType} onClose={() => setFormOpen(false)} onSaved={handleSaved} />}
    </div>
  )
}
