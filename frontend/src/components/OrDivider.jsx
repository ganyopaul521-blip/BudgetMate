import { useTranslation } from 'react-i18next'

export default function OrDivider({ label }) {
  const { t } = useTranslation()
  const resolvedLabel = label ?? t('auth.orContinueWith')
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
      {resolvedLabel}
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
    </div>
  )
}
