import { forwardRef, useId } from 'react'

const Input = forwardRef(function Input(
  { label, hint, error, leftIcon: LeftIcon, rightElement, id, className = '', required, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && (
            <span className="ml-0.5 text-rose-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
            LeftIcon ? 'pl-9' : ''
          } ${rightElement ? 'pr-10' : ''} ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-700 dark:focus:ring-rose-900/40'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-900/40'
          } ${className}`}
          {...props}
        />
        {rightElement && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{rightElement}</div>}
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

export default Input
