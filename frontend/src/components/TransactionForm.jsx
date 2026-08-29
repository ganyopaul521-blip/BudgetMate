import { useEffect, useState } from 'react'
import { categoriesApi, transactionsApi } from '../api/endpoints'
import { PAYMENT_METHOD_LABELS } from '../utils/format'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'
import Select from './Select'

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
  const [categoryError, setCategoryError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    categoriesApi.list(form.type).then((res) => setCategories(res.data.categories))
  }, [form.type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCategoryError('')
    if (!form.categoryId) {
      setCategoryError('Please choose a category')
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
    <Modal open onClose={onClose} title={transaction ? 'Edit Transaction' : 'Add Transaction'}>
      <div className="mb-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Transaction type">
        <button
          type="button"
          role="radio"
          aria-checked={form.type === 'income'}
          onClick={() => setForm({ ...form, type: 'income', categoryId: '' })}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
            form.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Income
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={form.type === 'expense'}
          onClick={() => setForm({ ...form, type: 'expense', categoryId: '' })}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
            form.type === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </p>
        )}

        <Input
          label="Amount (GH₵)"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          required
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="0.00"
        />

        <Select
          label="Category"
          required
          value={form.categoryId}
          error={categoryError}
          onChange={(e) => {
            setForm({ ...form, categoryId: e.target.value })
            setCategoryError('')
          }}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input
          label="Date"
          type="date"
          required
          value={form.transactionDate}
          onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
        />

        <Select
          label="Payment Method"
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        >
          {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Input
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. Trotro fare, Jollof at Osu"
        />

        <Button type="submit" fullWidth loading={submitting} className="mt-1">
          {submitting ? 'Saving...' : 'Save Transaction'}
        </Button>
      </form>
    </Modal>
  )
}
