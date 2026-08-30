import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Bot, TrendingDown, TrendingUp } from 'lucide-react'
import Badge from '../Badge'

const BUDGETS = [
  { label: 'Food & Groceries', pct: 62, tone: 'bg-emerald-500' },
  { label: 'Data & Airtime', pct: 88, tone: 'bg-amber-500' },
  { label: 'Transport', pct: 104, tone: 'bg-rose-500' },
]

const TRANSACTIONS = [
  { label: 'Jollof & Rice', category: 'Food', amount: -45, },
  { label: 'MTN MoMo Data Bundle', category: 'Data & Airtime', amount: -25 },
  { label: 'Part-time gig payment', category: 'Income', amount: 350 },
]

/**
 * Static, illustrative product preview — not a live view of any real account.
 * `variant="compact"` is used in the hero; `variant="full"` adds a mini
 * transaction list for the larger product-showcase mockup.
 */
export default function DashboardPreview({ variant = 'compact' }) {
  const isFull = variant === 'full'

  return (
    <div
      className="relative w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      role="img"
      aria-label="Illustrative preview of the BudgetMate dashboard showing balance, income, expenses, and budget progress"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">This Month</span>
        <Badge tone="neutral">Preview</Badge>
      </div>

      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Current balance</p>
      <p className="mt-0.5 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 4,850.00</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 3,200.00</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <TrendingDown size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Expenses</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 1,840.00</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {BUDGETS.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">{b.label}</span>
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
        <span>
          <strong className="font-semibold">Transport</strong> is over budget by GH₵ 20.00
        </span>
      </div>

      {isFull && (
        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Recent transactions</p>
          <div className="space-y-2.5">
            {TRANSACTIONS.map((t) => {
              const isIncome = t.amount > 0
              return (
                <div key={t.label} className="flex items-center gap-2.5">
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
                    <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{t.label}</p>
                    <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{t.category}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                  >
                    {isIncome ? '+' : '-'}GH₵ {Math.abs(t.amount).toFixed(2)}
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
