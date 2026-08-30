import { AlertTriangle, XCircle } from 'lucide-react'
import { formatDate } from '../utils/format'

export default function NotificationItem({ alert }) {
  const exceeded = alert.alertType === 'exceeded'
  const Icon = exceeded ? XCircle : AlertTriangle

  return (
    <div
      className={`relative px-4 py-3 text-sm ${alert.isRead ? 'bg-white dark:bg-slate-900' : 'bg-indigo-50/60 dark:bg-indigo-500/10'}`}
    >
      {!alert.isRead && <span className="absolute left-1.5 top-4 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" aria-hidden="true" />}
      <div className="flex gap-2 pl-2">
        <Icon
          size={16}
          className={`mt-0.5 shrink-0 ${exceeded ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className={`font-medium ${exceeded ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {exceeded ? 'Budget exceeded' : 'Approaching budget limit'}: {alert.categoryName}
          </p>
          <p className="text-slate-500 dark:text-slate-400">{alert.percentUsed}% of budget used</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{formatDate(alert.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}
