import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCountUp } from '../hooks/useCountUp'
import { formatAmount, getCurrencySymbol } from '../utils/format'

const MASK = '••••••'

// Counts up to the real amount and splits the currency symbol out at a
// smaller size - purely typographic, the underlying value is untouched.
function AnimatedAmount({ amount, size = 'lg' }) {
  const { user } = useAuth()
  const animated = useCountUp(amount)
  const symbolClass = size === 'lg' ? 'text-lg opacity-60' : 'text-xs opacity-60'
  return (
    <>
      <span className={`${symbolClass} mr-1 font-medium`}>{getCurrencySymbol(user?.currency)}</span>
      {formatAmount(animated)}
    </>
  )
}
const WAVE_WIDTH = 300
const WAVE_HEIGHT = 100

// Smooths a small set of points into a wavy path using quadratic curves
// through their midpoints - a standard trick for turning a handful of real
// data points into a gentle curve instead of a jagged polyline.
function buildWavePath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    const midY = (p0.y + p1.y) / 2
    d += ` Q ${p0.x} ${p0.y} ${midX} ${midY}`
  }
  const last = points[points.length - 1]
  d += ` T ${last.x} ${last.y}`
  return d
}

// Builds the decorative background wave from the real 6-month net trend
// (income - expense per month) - not fabricated, just smoothed and scaled
// to fill the card. Flat/zero data (a brand-new account) legitimately
// renders as a flat line rather than a fake squiggle.
function computeNetWave(months) {
  if (months.length < 2) return { line: '', area: '' }

  const values = months.map((m) => m.income - m.expense)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * WAVE_WIDTH,
    // Padded 20-80 band so peaks/troughs never touch the card edges.
    y: 80 - ((v - min) / range) * 60,
  }))

  const line = buildWavePath(points)
  const area = `${line} L ${WAVE_WIDTH} ${WAVE_HEIGHT} L 0 ${WAVE_HEIGHT} Z`
  return { line, area }
}

/**
 * Hero balance card: real net balance + income/expense breakdown, with a
 * decorative wave built from the real 6-month net trend (no separate fetch,
 * no fabricated figures), plus a privacy toggle that masks the figures
 * on-screen (state only, nothing sent anywhere).
 */
export default function BalanceHero({ balance, months, incomeTrend, expenseTrend, periodLabel = 'This Month' }) {
  const [hidden, setHidden] = useState(false)
  const isPositive = balance.net >= 0
  const wave = computeNetWave(months)

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg sm:p-6 ${
        isPositive ? 'from-indigo-600 via-indigo-700 to-violet-800' : 'from-rose-600 via-rose-700 to-rose-900'
      }`}
    >
      {wave.area && (
        <svg
          viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 w-full"
          aria-hidden="true"
        >
          <path d={wave.area} className="fill-white/10" />
          <path d={wave.line} fill="none" className="stroke-white/30" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      <div className="relative flex items-center justify-between">
        <p className={`text-sm font-medium ${isPositive ? 'text-indigo-100' : 'text-rose-100'}`}>{periodLabel}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
          <Wallet size={17} />
        </span>
      </div>

      <div className="relative mt-4 flex items-center gap-2">
        <p className={`text-xs font-medium ${isPositive ? 'text-indigo-100' : 'text-rose-100'}`}>Net Balance</p>
        <button
          onClick={() => setHidden((v) => !v)}
          aria-label={hidden ? 'Show balance figures' : 'Hide balance figures'}
          aria-pressed={hidden}
          className={`rounded-full p-1 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${isPositive ? 'text-indigo-100' : 'text-rose-100'}`}
        >
          {hidden ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
        </button>
      </div>
      <p className="relative mt-1 text-3xl font-bold tabular-nums">
        {hidden ? MASK : <AnimatedAmount amount={balance.net} size="lg" />}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <TrendingUp size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="mt-1 text-sm font-bold tabular-nums text-white">
            {hidden ? MASK : <AnimatedAmount amount={balance.totalIncome} size="sm" />}
          </p>
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
          <p className="mt-1 text-sm font-bold tabular-nums text-white">
            {hidden ? MASK : <AnimatedAmount amount={balance.totalExpense} size="sm" />}
          </p>
          {expenseTrend && (
            <p className={`mt-0.5 text-[11px] ${isPositive ? 'text-indigo-200' : 'text-rose-200'}`}>
              {expenseTrend.up ? '↑' : '↓'} {expenseTrend.value}% vs last month
            </p>
          )}
        </div>
      </div>

      <div className="relative flex-1" aria-hidden="true" />
    </div>
  )
}
