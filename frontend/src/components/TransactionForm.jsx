import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesApi, transactionsApi } from '../api/endpoints'
import { PAYMENT_METHOD_LABELS } from '../utils/format'

const emptyForm = (type) => ({
  type,
  amount: '',
  categoryId: '',
  transactionDate: new Date().toISOString().slice(0, 10),
  description: '',
  paymentMethod: 'cash',
})

export default function TransactionForm({ initialType = 'expense', transaction, onClose, onSaved }) {
  const [form, setForm] = useState(
    transaction
      ? {
          type: transaction.type,
          amount: String(transaction.amount),
          categoryId: transaction.categoryId,
          transactionDate: new Date(transaction.transactionDate).toISOString().slice(0, 10),
          description: transaction.description || '',
          paymentMethod: transaction.paymentMethod,
        }
      : emptyForm(initialType)
  )
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    categoriesApi.list(form.type).then((res) => setCategories(res.data.categories))
  }, [form.type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.categoryId) {
      setError('Please choose a category')
      return
    }
    setSubmitting(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      let alert = null
      if (transaction) {
        const res = await transactionsApi.update(transaction.id, payload)
        alert = res.data.alert
      } else {
        const res = await transactionsApi.create(payload)
        alert = res.data.alert
      }
      onSaved(alert)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save transaction')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'income', categoryId: '' })}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              form.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'expense', categoryId: '' })}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              form.type === 'expense' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount (GH₵)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              required
              value={form.transactionDate}
              onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description (optional)</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Trotro fare, Jollof at Osu"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}
