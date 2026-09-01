import { Plus, Receipt, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesApi, transactionsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Select from '../components/Select'
import TransactionCard from '../components/TransactionCard'
import TransactionDetails from '../components/TransactionDetails'
import TransactionForm from '../components/TransactionForm'
import TransactionSummary from '../components/TransactionSummary'
import TransactionTable from '../components/TransactionTable'
import { useToast } from '../context/ToastContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'

const emptyFilters = { type: '', categoryId: '', from: '', to: '', search: '' }

export default function Transactions() {
  const { showToast } = useToast()
  const formatCurrency = useFormatCurrency()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState({ by: 'date', order: 'desc' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [alert, setAlert] = useState(null)
  const pageSize = 20

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const params = {
        page,
        pageSize,
        sortBy: sort.by,
        sortOrder: sort.order,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      }
      const res = await transactionsApi.list(params)
      setTransactions(res.data.transactions)
      setTotal(res.data.total)
      setSummary(res.data.summary)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data.categories))
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, sort])

  const handleSort = (field) => {
    setPage(1)
    setSort((prev) => (prev.by === field ? { by: field, order: prev.order === 'asc' ? 'desc' : 'asc' } : { by: field, order: 'asc' }))
  }

  const handleSaved = (newAlert) => {
    const wasEditing = !!editing
    setFormOpen(false)
    setEditing(null)
    if (newAlert) setAlert(newAlert)
    showToast(wasEditing ? 'Transaction updated successfully.' : 'Transaction added successfully.')
    setPage(1)
    load()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await transactionsApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      showToast('Transaction deleted successfully.')
      load()
    } catch {
      showToast('Unable to delete transaction. Please try again.', { type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
    setPage(1)
  }

  const hasFilters = Object.values(filters).some(Boolean)
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Track, review and manage your income and expenses."
        actions={
          <Button
            leftIcon={Plus}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            Add Transaction
          </Button>
        }
      />

      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />

      {error ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">Unable to load transactions</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">We couldn't retrieve your transactions right now.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={load}>
            Try Again
          </Button>
        </Card>
      ) : (
        <>
          {loading && !summary ? <LoadingState variant="stats" /> : <TransactionSummary summary={summary} />}

          <Card className="mb-4 mt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="sm:col-span-1 lg:col-span-2">
                <Input
                  leftIcon={Search}
                  placeholder="Search transactions..."
                  aria-label="Search transactions by description or category"
                  value={filters.search}
                  onChange={(e) => {
                    setPage(1)
                    setFilters({ ...filters, search: e.target.value })
                  }}
                  rightElement={
                    filters.search ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPage(1)
                          setFilters({ ...filters, search: '' })
                        }}
                        aria-label="Clear search"
                        className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-slate-300"
                      >
                        <X size={14} />
                      </button>
                    ) : undefined
                  }
                />
              </div>
              <Select
                aria-label="Filter by type"
                value={filters.type}
                onChange={(e) => {
                  setPage(1)
                  setFilters({ ...filters, type: e.target.value })
                }}
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              <Select
                aria-label="Filter by category"
                value={filters.categoryId}
                onChange={(e) => {
                  setPage(1)
                  setFilters({ ...filters, categoryId: e.target.value })
                }}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Input
                type="date"
                aria-label="From date"
                value={filters.from}
                onChange={(e) => {
                  setPage(1)
                  setFilters({ ...filters, from: e.target.value })
                }}
              />
              <Input
                type="date"
                aria-label="To date"
                value={filters.to}
                onChange={(e) => {
                  setPage(1)
                  setFilters({ ...filters, to: e.target.value })
                }}
              />
            </div>
            {hasFilters && (
              <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>

          {loading ? (
            <LoadingState variant="table" rows={6} />
          ) : (
            <Card padded={false} className="overflow-hidden">
              {transactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title={hasFilters ? 'No transactions found' : 'No transactions yet'}
                  description={
                    hasFilters
                      ? 'Try adjusting your search or filters.'
                      : 'Your financial activity will appear here once you add your first transaction.'
                  }
                  action={
                    hasFilters ? (
                      <Button variant="secondary" size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    ) : (
                      <Button size="sm" leftIcon={Plus} onClick={() => setFormOpen(true)}>
                        Add Transaction
                      </Button>
                    )
                  }
                />
              ) : (
                <>
                  <div className="hidden md:block">
                    <TransactionTable
                      transactions={transactions}
                      sort={sort}
                      onSort={handleSort}
                      onView={setViewing}
                      onEdit={(t) => {
                        setEditing(t)
                        setFormOpen(true)
                      }}
                      onDelete={setDeleteTarget}
                    />
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
                    {transactions.map((t) => (
                      <TransactionCard
                        key={t.id}
                        transaction={t}
                        onView={setViewing}
                        onEdit={(tx) => {
                          setEditing(tx)
                          setFormOpen(true)
                        }}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </div>

                  <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
                </>
              )}
            </Card>
          )}
        </>
      )}

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

      <TransactionDetails
        transaction={viewing}
        onClose={() => setViewing(null)}
        onEdit={(t) => {
          setViewing(null)
          setEditing(t)
          setFormOpen(true)
        }}
        onDelete={(t) => {
          setViewing(null)
          setDeleteTarget(t)
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete transaction?"
        message={
          deleteTarget
            ? `Are you sure you want to delete this ${formatCurrency(deleteTarget.amount)} ${deleteTarget.category.name} ${deleteTarget.type}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Transaction"
      />
    </div>
  )
}
