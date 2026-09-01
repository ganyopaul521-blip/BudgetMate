import { Pencil, Trash2 } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

export default function TransactionCard({ transaction, onView, onEdit, onDelete }) {
  const formatCurrency = useFormatCurrency()
  const isIncome = transaction.type === 'income'
  const CategoryIcon = getCategoryIcon(transaction.category.name)

  const icon = (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        isIncome
          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
          : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
      }`}
      aria-hidden="true"
    >
      <CategoryIcon size={16} />
    </div>
  )

  const details = (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{transaction.category.name}</p>
      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
        {transaction.description || PAYMENT_METHOD_LABELS[transaction.paymentMethod]} · {formatDate(transaction.transactionDate)}
      </p>
    </div>
  )

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0 dark:border-slate-800">
      {onView ? (
        <button
          onClick={() => onView(transaction)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {icon}
          {details}
        </button>
      ) : (
        <>
          {icon}
          {details}
        </>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <span
          className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="ml-1 flex">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                title="Edit"
                aria-label={`Edit transaction: ${transaction.category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction)}
                title="Delete"
                aria-label={`Delete transaction: ${transaction.category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
