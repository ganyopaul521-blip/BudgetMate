import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useFormatCurrency } from '../hooks/useFormatCurrency'

/**
 * Hero balance card: real net balance + income/expense breakdown, with a
 * lightweight 6-month bar preview built from the same monthly-comparison
 * data used elsewhere (no separate fetch, no fabricated figures).
 */
export default function BalanceHero({ balance, months, incomeTrend, expenseTrend }) {
  const formatCurrency = useFormatCurrency()
  const isPositive = balance.net >= 0
  const maxVal = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]))

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg sm:p-6 ${
        isPositive ? 'from-indigo-600 via-indigo-700 to-violet-800' : 'from-rose-600 via-rose-700 to-rose-900'
      }`}
    >
      <div
        className="animate-glow-pulse pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <p className={`text-sm font-medium ${isPositive ? 'text-indigo-100' : 'text-rose-100'}`}>This Month</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
          <Wallet size={17} />
        </span>
      </div>

      <p className={`relative mt-4 text-xs font-medium ${isPositive ? 'text-indigo-100' : 'text-rose-100'}`}>Net Balance</p>
      <p className="relative mt-1 text-3xl font-bold tabular-nums">{formatCurrency(balance.net)}</p>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <TrendingUp size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="mt-1 text-sm font-bold tabular-nums text-white">{formatCurrency(balance.totalIncome)}</p>
          {incomeTrend && (
            <p className={`mt-0.5 text-[11px] ${isPositive ? 'text-indigo-200' : 'text-rose-200'}`}>
              {incomeTrend.up ? '↑' : '↓'} {incomeTrend.value}% vs last month
            </p>
          )}
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1.5 text-rose-200">
            <TrendingDown size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Expenses</span>
          </div>
          <p className="mt-1 text-sm font-bold tabular-nums text-white">{formatCurrency(balance.totalExpense)}</p>
          {expenseTrend && (
            <p className={`mt-0.5 text-[11px] ${isPositive ? 'text-indigo-200' : 'text-rose-200'}`}>
              {expenseTrend.up ? '↑' : '↓'} {expenseTrend.value}% vs last month
            </p>
          )}
        </div>
      </div>

      {months.length > 0 && (
        <div
          className="relative mt-6 flex flex-1 items-end justify-between gap-2"
          role="img"
          aria-label="Monthly income and expenses for the last six months"
        >
          {months.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end justify-center gap-1" aria-hidden="true">
                <div className="w-2 rounded-t-sm bg-white/45 sm:w-2.5" style={{ height: `${(m.income / maxVal) * 100}%` }} />
                <div className="w-2 rounded-t-sm bg-white sm:w-2.5" style={{ height: `${(m.expense / maxVal) * 100}%` }} />
              </div>
              <span className={`text-[10px] font-medium ${isPositive ? 'text-indigo-200' : 'text-rose-200'}`}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
