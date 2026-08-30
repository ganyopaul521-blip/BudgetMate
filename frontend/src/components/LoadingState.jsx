function Shimmer({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
}

/** variant: 'page' | 'stats' | 'cards' | 'table' */
export default function LoadingState({ variant = 'page', rows = 4, cards = 4 }) {
  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="status" aria-label="Loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="mt-3 h-7 w-32" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="status" aria-label="Loading">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="mt-4 h-2.5 w-full" />
            <Shimmer className="mt-3 h-4 w-40" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" role="status" aria-label="Loading">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0 dark:border-slate-800">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-4 w-32" />
            <Shimmer className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
