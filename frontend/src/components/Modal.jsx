import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

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

    // Body-scroll lock that also works on iOS Safari: a plain
    // `overflow: hidden` toggle doesn't stop touch-scrolling the page
    // behind a fixed-position modal there, which is what made the sheet
    // look "frozen" / the page scroll instead of the modal's own content.
    // Pinning the body at its current scroll offset blocks that, and we
    // restore the exact scroll position on close.
    const scrollY = window.scrollY
    const body = document.body
    const prev = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      window.scrollTo(0, scrollY)
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-md'

  // Rendered through a portal straight into <body>, bypassing the
  // overflow-hidden/relative wrapper every signed-in page sits inside
  // (needed to clip the skyline background). Without the portal, that
  // ancestor could clip this fixed-position overlay or interfere with its
  // internal scrolling depending on the browser - the "modal goes dark on
  // phone" and "can't scroll the popup on laptop" symptoms.
  return createPortal(
    <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain px-4 py-6">
      <div
        className="motion-safe:animate-[backdrop-in_0.15s_ease-out] fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex min-h-full items-center justify-center">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={`motion-safe:animate-[modal-in_0.18s_ease-out] relative z-10 max-h-[85dvh] w-full overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6 ${sizeClass}`}
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
    </div>,
    document.body
  )
}
