import { Plus, Receipt, Search } from 'lucide-react'
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
import Select from '../components/Select'
import TransactionCard from '../components/TransactionCard'
import TransactionForm from '../components/TransactionForm'
import TransactionTable from '../components/TransactionTable'
import { useFormatCurrency } from '../hooks/useFormatCurrency'

const emptyFilters = { type: '', categoryId: '', from: '', to: '', search: '' }

export default function Transactions() {
  const formatCurrency = useFormatCurrency()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [alert, setAlert] = useState(null)
  const pageSize = 20

  const load = async () => {
    setLoading(true)
    const params = { page, pageSize, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
    const res = await transactionsApi.list(params)
    setTransactions(res.data.transactions)
    setTotal(res.data.total)
    setLoading(false)
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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await transactionsApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  const hasFilters = Object.values(filters).some(Boolean)
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Every income and expense you've recorded."
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

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="sm:col-span-1 lg:col-span-2">
            <Input
              leftIcon={Search}
              placeholder="Search description..."
              aria-label="Search transactions by description"
              value={filters.search}
              onChange={(e) => {
                setPage(1)
                setFilters({ ...filters, search: e.target.value })
              }}
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
      </Card>

      {loading ? (
        <LoadingState variant="table" rows={6} />
      ) : (
        <Card padded={false} className="overflow-hidden">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={hasFilters ? 'No matching transactions' : 'No transactions yet'}
              description={
                hasFilters
                  ? 'Try adjusting or clearing your filters.'
                  : 'Add your first income or expense to start tracking.'
              }
              action={
                hasFilters ? (
                  <Button variant="secondary" size="sm" onClick={() => setFilters(emptyFilters)}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="sm" leftIcon={Plus} onClick={() => setFormOpen(true)}>
                    Add transaction
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className="hidden md:block">
                <TransactionTable
                  transactions={transactions}
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
                    onEdit={(tx) => {
                      setEditing(tx)
                      setFormOpen(true)
                    }}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>
                  Page {page} of {totalPages} &middot; {total} total
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this transaction?"
        message={
          deleteTarget
            ? `This will permanently remove the ${deleteTarget.type} of ${formatCurrency(deleteTarget.amount)} for ${deleteTarget.category.name}.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  )
}
