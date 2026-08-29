import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesApi, transactionsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import TransactionForm from '../components/TransactionForm'
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

const emptyFilters = { type: '', categoryId: '', from: '', to: '', search: '' }

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [alert, setAlert] = useState(null)
  const pageSize = 20

  const load = async () => {
    const params = { page, pageSize, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
    const res = await transactionsApi.list(params)
    setTransactions(res.data.transactions)
    setTotal(res.data.total)
  }

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data.categories))
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters])

  const handleSaved = (newAlert) => {
    setFormOpen(false)
    setEditing(null)
    if (newAlert) setAlert(newAlert)
    setPage(1)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    await transactionsApi.remove(id)
    load()
  }

  const totalPages = Math.max(Math.ceil(total / pageSize), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="relative col-span-2 sm:col-span-1 lg:col-span-2">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => {
              setPage(1)
              setFilters({ ...filters, search: e.target.value })
            }}
            className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => {
            setPage(1)
            setFilters({ ...filters, type: e.target.value })
          }}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.categoryId}
          onChange={(e) => {
            setPage(1)
            setFilters({ ...filters, categoryId: e.target.value })
          }}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => {
            setPage(1)
            setFilters({ ...filters, from: e.target.value })
          }}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => {
            setPage(1)
            setFilters({ ...filters, to: e.target.value })
          }}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(t.transactionDate)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{t.category.name}</td>
                  <td className="px-4 py-3 text-slate-500">{t.description || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {PAYMENT_METHOD_LABELS[t.paymentMethod]}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                      t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditing(t)
                          setFormOpen(true)
                        }}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <TransactionForm
          transaction={editing}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
