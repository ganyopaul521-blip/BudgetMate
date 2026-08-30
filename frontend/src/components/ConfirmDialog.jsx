import { AlertTriangle } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
          }`}
          aria-hidden="true"
        >
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          {message && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
