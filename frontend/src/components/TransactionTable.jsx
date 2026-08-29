import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">
              Date
            </th>
            <th scope="col" className="px-4 py-3">
              Category
            </th>
            <th scope="col" className="px-4 py-3">
              Description
            </th>
            <th scope="col" className="px-4 py-3">
              Method
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Amount
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{formatDate(t.transactionDate)}</td>
              <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-800">{t.category.name}</td>
              <td className="max-w-[220px] truncate px-4 py-3.5 text-slate-500">{t.description || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{PAYMENT_METHOD_LABELS[t.paymentMethod]}</td>
              <td
                className={`whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    aria-label={`Edit transaction: ${t.category.name}`}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    aria-label={`Delete transaction: ${t.category.name}`}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
