import { Minus, PiggyBank, Plus, Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import TransactionCard from '../components/TransactionCard'
import TransactionForm from '../components/TransactionForm'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState('expense')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const res = await reportsApi.dashboard()
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openForm = (type) => {
    setFormType(type)
    setFormOpen(true)
  }

  const handleSaved = (newAlert) => {
    setFormOpen(false)
    if (newAlert) setAlert(newAlert)
    load()
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}`}
        description="Here's your financial snapshot for this month."
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

      {loading || !data ? (
        <div className="space-y-6">
          <LoadingState variant="stats" />
          <LoadingState variant="cards" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Income" value={formatCurrency(data.balance.totalIncome)} icon={TrendingUp} tone="success" />
            <StatCard label="Total Expenses" value={formatCurrency(data.balance.totalExpense)} icon={TrendingDown} tone="danger" />
            <StatCard
              label="Net Balance"
              value={formatCurrency(data.balance.net)}
              icon={Wallet}
              tone={data.balance.net >= 0 ? 'brand' : 'danger'}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card padded={false}>
              <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 className="font-semibold text-slate-900">Budget Status</h2>
                <Link to="/budgets" className="text-xs font-medium text-indigo-600 hover:underline">
                  Manage
                </Link>
              </div>
              {data.budgetStatus.length === 0 ? (
                <EmptyState
                  icon={PiggyBank}
                  title="No budgets set yet"
                  description="Set a monthly limit per category to track your spending."
                  action={
                    <Button as={Link} to="/budgets" variant="secondary" size="sm">
                      Set a budget
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  {data.budgetStatus.map((b) => (
                    <div key={b.categoryId}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{b.categoryName}</span>
                        <span className="text-slate-500 tabular-nums">
                          {formatCurrency(b.spent)} / {formatCurrency(b.amountLimit)}
                        </span>
                      </div>
                      <ProgressBar percent={b.percentUsed} label={`${b.categoryName} budget usage`} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card padded={false}>
              <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
                <Link to="/transactions" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              {data.recentTransactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No transactions yet"
                  description="Add your first income or expense to get started."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => openForm('expense')}>
                      Add transaction
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
      )}

      {formOpen && (
        <TransactionForm initialType={formType} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  )
}
