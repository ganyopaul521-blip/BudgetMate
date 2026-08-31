import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Bot, TrendingDown, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Badge from '../Badge'

const BUDGET_META = [
  { pct: 62, tone: 'bg-emerald-500' },
  { pct: 88, tone: 'bg-amber-500' },
  { pct: 104, tone: 'bg-rose-500' },
]

const TRANSACTION_AMOUNTS = [-45, -25, 350]

/**
 * Static, illustrative product preview — not a live view of any real account.
 * `variant="compact"` is used in the hero; `variant="full"` adds a mini
 * transaction list for the larger product-showcase mockup.
 */
export default function DashboardPreview({ variant = 'compact' }) {
  const { t } = useTranslation()
  const isFull = variant === 'full'
  const budgetLabels = t('dashboardPreview.budgetLabels', { returnObjects: true })
  const transactions = t('dashboardPreview.transactions', { returnObjects: true })

  return (
    <div
      className="relative w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      role="img"
      aria-label={t('dashboardPreview.ariaLabel')}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('dashboardPreview.thisMonth')}</span>
        <Badge tone="neutral">{t('dashboardPreview.preview')}</Badge>
      </div>

      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('dashboardPreview.currentBalance')}</p>
      <p className="mt-0.5 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 4,850.00</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} aria-hidden="true" />
            <span className="text-xs font-medium">{t('dashboardPreview.income')}</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 3,200.00</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <TrendingDown size={14} aria-hidden="true" />
            <span className="text-xs font-medium">{t('dashboardPreview.expenses')}</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 1,840.00</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {BUDGET_META.map((b, i) => (
          <div key={budgetLabels[i]}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">{budgetLabels[i]}</span>
              <span className="text-slate-400 dark:text-slate-500">{b.pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full ${b.tone}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-400">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{t('dashboardPreview.overBudget', { category: budgetLabels[2] })}</span>
      </div>

      {isFull && (
        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {t('dashboardPreview.recentTransactions')}
          </p>
          <div className="space-y-2.5">
            {transactions.map((tx, i) => {
              const amount = TRANSACTION_AMOUNTS[i]
              const isIncome = amount > 0
              return (
                <div key={tx.label} className="flex items-center gap-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isIncome
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
                    }`}
                    aria-hidden="true"
                  >
                    {isIncome ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{tx.label}</p>
                    <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{tx.category}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                  >
                    {isIncome ? '+' : '-'}GH₵ {Math.abs(amount).toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
        <Bot size={22} aria-hidden="true" />
      </div>
    </div>
  )
}
