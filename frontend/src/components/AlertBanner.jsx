import { AlertTriangle, X } from 'lucide-react'

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null
  const exceeded = alert.alertType === 'exceeded'

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        exceeded ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">{exceeded ? 'Budget exceeded' : 'Approaching budget limit'}:</span>{' '}
          {alert.categoryName} is at {alert.percentUsed}% of its monthly budget.
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss alert"
        className="shrink-0 rounded-full p-0.5 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X size={16} />
      </button>
    </div>
  )
}
