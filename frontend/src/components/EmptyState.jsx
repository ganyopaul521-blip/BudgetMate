import { Sparkles } from 'lucide-react'

export default function EmptyState({ icon: Icon, title, description, action, decorative = false, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}>
      {Icon && (
        <div className="relative mb-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400"
            aria-hidden="true"
          >
            <Icon size={26} />
          </div>
          {decorative && (
            <>
              <Sparkles
                size={13}
                className="absolute -right-1 -top-1 text-indigo-400 dark:text-indigo-300"
                aria-hidden="true"
              />
              <Sparkles
                size={9}
                className="absolute -bottom-0.5 -left-1.5 text-violet-400 dark:text-violet-300"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      )}
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
