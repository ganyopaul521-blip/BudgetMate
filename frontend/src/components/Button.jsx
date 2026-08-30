import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-900',
  secondary:
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-indigo-500 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:disabled:text-slate-600',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 disabled:bg-emerald-300 dark:disabled:bg-emerald-900',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 disabled:bg-rose-300 dark:disabled:bg-rose-900',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-indigo-500 disabled:text-slate-300 dark:text-slate-300 dark:hover:bg-slate-800 dark:disabled:text-slate-600',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
}

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    className = '',
    children,
    disabled,
    type,
    ...props
  },
  ref
) {
  const isButtonTag = Component === 'button'

  return (
    <Component
      ref={ref}
      {...(isButtonTag ? { type: type || 'button', disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      aria-disabled={!isButtonTag && (disabled || loading) ? true : undefined}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-slate-900 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'lg' ? 18 : 16} className="animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon size={size === 'lg' ? 18 : 16} aria-hidden="true" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon size={size === 'lg' ? 18 : 16} aria-hidden="true" />}
    </Component>
  )
})

export default Button
