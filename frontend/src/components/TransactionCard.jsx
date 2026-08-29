import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
        }`}
        aria-hidden="true"
      >
        {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{transaction.category.name}</p>
        <p className="truncate text-xs text-slate-400">
          {transaction.description || PAYMENT_METHOD_LABELS[transaction.paymentMethod]} · {formatDate(transaction.transactionDate)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="ml-1 flex">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                aria-label={`Edit transaction: ${transaction.category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction)}
                aria-label={`Delete transaction: ${transaction.category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
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
