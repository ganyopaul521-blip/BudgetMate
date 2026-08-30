import { AlertCircle } from 'lucide-react'

/** Curated, professional error banner for auth/forms — never renders raw API error text. */
export default function FormError({ title, message, className = '' }) {
  if (!title && !message) return null

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg bg-rose-50 px-3.5 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 ${className}`}
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {message && <p className={title ? 'mt-0.5' : ''}>{message}</p>}
      </div>
    </div>
  )
}
