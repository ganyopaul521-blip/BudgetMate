import { forwardRef, useId } from 'react'

const Input = forwardRef(function Input(
  { label, hint, error, leftIcon: LeftIcon, id, className = '', required, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <LeftIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
            LeftIcon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
          } ${className}`}
          {...props}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
