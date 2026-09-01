import { AlertCircle, CheckCircle2, X } from 'lucide-react'

const STYLES = {
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    classes: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-400',
  },
}

export default function Toast({ toast, onDismiss }) {
  const style = STYLES[toast.type] || STYLES.success
  const Icon = style.icon

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg motion-safe:animate-[toast-in_0.2s_ease-out] ${style.classes}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-full p-0.5 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X size={15} />
      </button>
    </div>
  )
}
