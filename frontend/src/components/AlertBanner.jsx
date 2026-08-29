import { AlertTriangle, X } from 'lucide-react'

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null
  const exceeded = alert.alertType === 'exceeded'

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        exceeded ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">{exceeded ? 'Budget exceeded' : 'Approaching budget limit'}:</span>{' '}
          {alert.categoryName} is at {alert.percentUsed}% of its monthly budget.
        </p>
      </div>
      <button onClick={onDismiss} className="shrink-0 rounded-full p-0.5 hover:bg-black/5">
        <X size={16} />
      </button>
    </div>
  )
}
