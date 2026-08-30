import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const panelRef = useRef(null)
  const titleId = useId()
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement

    const panel = panelRef.current
    const focusable = panel?.querySelectorAll(FOCUSABLE_SELECTOR)
    focusable?.[0]?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return

      const items = panel.querySelectorAll(FOCUSABLE_SELECTOR)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-md'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] dark:bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6 ${sizeClass}`}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
