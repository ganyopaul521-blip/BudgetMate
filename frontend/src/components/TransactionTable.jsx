import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown size={13} className="text-slate-300 dark:text-slate-600" aria-hidden="true" />
  return direction === 'asc' ? (
    <ArrowUp size={13} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
  ) : (
    <ArrowDown size={13} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
  )
}

function SortableHeader({ label, field, sort, onSort, align = 'left' }) {
  const active = sort.by === field
  return (
    <th scope="col" className={`px-4 py-3 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-slate-200 ${align === 'right' ? 'flex-row-reverse' : ''}`}
        aria-label={`Sort by ${label}${active ? `, currently ${sort.order === 'asc' ? 'ascending' : 'descending'}` : ''}`}
      >
        {label}
        <SortIcon active={active} direction={sort.order} />
      </button>
    </th>
  )
}

export default function TransactionTable({ transactions, sort, onSort, onView, onEdit, onDelete }) {
  const formatCurrency = useFormatCurrency()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <SortableHeader label="Date" field="date" sort={sort} onSort={onSort} />
            <th scope="col" className="px-4 py-3">
              Transaction
            </th>
            <SortableHeader label="Category" field="category" sort={sort} onSort={onSort} />
            <th scope="col" className="px-4 py-3">
              Payment Method
            </th>
            <SortableHeader label="Amount" field="amount" sort={sort} onSort={onSort} align="right" />
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((t) => {
            const isIncome = t.type === 'income'
            const CategoryIcon = getCategoryIcon(t.category.name)
            const color = getCategoryColor(t.category.name)
            return (
              <tr key={t.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 dark:text-slate-400">{formatDate(t.transactionDate)}</td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onView(t)}
                    className="flex items-center gap-2.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`} aria-hidden="true">
                      <CategoryIcon size={15} />
                    </span>
                    <span className="max-w-[220px] truncate font-medium text-slate-800 dark:text-slate-100">
                      {t.description || PAYMENT_METHOD_LABELS[t.paymentMethod]}
                    </span>
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 dark:text-slate-400">{t.category.name}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {PAYMENT_METHOD_LABELS[t.paymentMethod]}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(t)}
                      title="Edit"
                      aria-label={`Edit transaction: ${t.category.name}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      title="Delete"
                      aria-label={`Delete transaction: ${t.category.name}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
