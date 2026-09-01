import { Pencil, Trash2 } from 'lucide-react'
import Badge from './Badge'
import Button from './Button'
import Modal from './Modal'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

export default function TransactionDetails({ transaction, onClose, onEdit, onDelete }) {
  const formatCurrency = useFormatCurrency()

  if (!transaction) return null

  const isIncome = transaction.type === 'income'
  const CategoryIcon = getCategoryIcon(transaction.category.name)

  return (
    <Modal open={!!transaction} onClose={onClose} title="Transaction Details">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isIncome
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
              : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
          }`}
          aria-hidden="true"
        >
          <CategoryIcon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900 dark:text-white">{transaction.category.name}</p>
          <Badge tone={isIncome ? 'success' : 'danger'} className="mt-1">
            {isIncome ? 'Income' : 'Expense'}
          </Badge>
        </div>
      </div>

      <p
        className={`mt-4 text-3xl font-bold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
      >
        {isIncome ? '+' : '−'}
        {formatCurrency(transaction.amount)}
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400 dark:text-slate-500">Category</dt>
          <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{transaction.category.name}</dd>
        </div>
        {transaction.description && (
          <div className="flex items-start justify-between gap-3">
            <dt className="shrink-0 text-slate-400 dark:text-slate-500">Description</dt>
            <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{transaction.description}</dd>
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400 dark:text-slate-500">Payment Method</dt>
          <dd className="text-right font-medium text-slate-700 dark:text-slate-200">
            {PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400 dark:text-slate-500">Date</dt>
          <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{formatDate(transaction.transactionDate)}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400 dark:text-slate-500">Added</dt>
          <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{formatDate(transaction.createdAt)}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-400 dark:text-slate-500">Reference</dt>
          <dd className="truncate text-right font-mono text-xs text-slate-400 dark:text-slate-500">{transaction.id}</dd>
        </div>
      </dl>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="danger" leftIcon={Trash2} onClick={() => onDelete(transaction)}>
          Delete
        </Button>
        <Button leftIcon={Pencil} onClick={() => onEdit(transaction)}>
          Edit Transaction
        </Button>
      </div>
    </Modal>
  )
}
