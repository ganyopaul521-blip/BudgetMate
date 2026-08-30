import Badge from '../Badge'
import Card from '../Card'
import Reveal from '../Reveal'

const MONTHS = [
  { label: 'May', income: 70, expense: 48 },
  { label: 'Jun', income: 82, expense: 60 },
  { label: 'Jul', income: 76, expense: 55 },
  { label: 'Aug', income: 100, expense: 58 },
]

const CATEGORIES = [
  { label: 'Rent & Housing', pct: 32, tone: 'bg-indigo-600' },
  { label: 'Food & Groceries', pct: 26, tone: 'bg-indigo-500' },
  { label: 'Transport', pct: 18, tone: 'bg-indigo-400' },
  { label: 'Data & Airtime', pct: 14, tone: 'bg-indigo-300' },
  { label: 'Other', pct: 10, tone: 'bg-slate-300 dark:bg-slate-600' },
]

export default function InsightsSection() {
  return (
    <section id="insights" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Know where your money goes.</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              BudgetMate summarises your income, expenses, and budget usage into reports you can actually read —
              so patterns in your spending stop being a mystery.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Income vs. Expenses</h3>
                <Badge tone="neutral">Illustrative</Badge>
              </div>
              <div className="flex h-32 items-end justify-between gap-3" role="img" aria-label="Sample chart comparing monthly income and expenses">
                {MONTHS.map((m) => (
                  <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-full w-full items-end justify-center gap-1">
                      <div
                        className="w-2.5 rounded-t-sm bg-emerald-500 sm:w-3.5"
                        style={{ height: `${m.income}%` }}
                        aria-hidden="true"
                      />
                      <div
                        className="w-2.5 rounded-t-sm bg-rose-400 sm:w-3.5"
                        style={{ height: `${m.expense}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" aria-hidden="true" /> Expenses
                </span>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">Spending by category</h3>
                {CATEGORIES.map((c) => (
                  <div key={c.label} className="flex items-center gap-2.5 text-xs">
                    <span className="w-28 shrink-0 text-slate-500 dark:text-slate-400">{c.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${c.tone}`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right text-slate-400 dark:text-slate-500">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
