import { ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'

const Select = forwardRef(function Select({ label, hint, error, id, className = '', required, children, ...props }, ref) {
  const generatedId = useId()
  const selectId = id || generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && (
            <span className="ml-0.5 text-rose-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-700 dark:focus:ring-rose-900/40'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-900/40'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
})

export default Select
