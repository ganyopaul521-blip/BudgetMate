import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { reportsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import BudgetProgressBar from '../components/BudgetProgressBar'
import TransactionForm from '../components/TransactionForm'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/format'

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

  if (loading || !data) {
    return <p className="text-slate-500">Loading dashboard...</p>
  }

  const { balance, recentTransactions, budgetStatus } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-slate-500">Here's your financial snapshot for this month.</p>
      </div>

      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{formatCurrency(balance.totalIncome)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(balance.totalExpense)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Net Balance</p>
          <p className={`mt-1 text-2xl font-bold ${balance.net >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            {formatCurrency(balance.net)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => openForm('income')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={16} /> Add Income
        </button>
        <button
          onClick={() => openForm('expense')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Minus size={16} /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Budget Status</h2>
          {budgetStatus.length === 0 && (
            <p className="text-sm text-slate-400">No budgets set for this month yet.</p>
          )}
          <div className="space-y-4">
            {budgetStatus.map((b) => (
              <BudgetProgressBar
                key={b.categoryId}
                categoryName={b.categoryName}
                spent={b.spent}
                amountLimit={b.amountLimit}
                percentUsed={b.percentUsed}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Recent Transactions</h2>
          {recentTransactions.length === 0 && (
            <p className="text-sm text-slate-400">No transactions recorded yet.</p>
          )}
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.category.name}</p>
                  <p className="text-xs text-slate-400">{t.description || formatDate(t.transactionDate)}</p>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {formOpen && (
        <TransactionForm initialType={formType} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  )
}
