import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCountUp } from '../hooks/useCountUp'
import { formatAmount, getCurrencySymbol } from '../utils/format'
import { computeSparkline } from '../utils/sparkline'

const MASK = '••••'
const SPARK_WIDTH = 120
const SPARK_HEIGHT = 40

const TONES = {
  hero: {
    card: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white',
    iconWrap: 'bg-white/15 text-white',
    label: 'text-indigo-100',
    trendGood: 'text-emerald-200',
    trendBad: 'text-rose-200',
    sparkStroke: 'stroke-white/40',
    sparkFill: 'fill-white/10',
    symbolClass: 'text-lg opacity-60',
  },
  success: {
    card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
    iconWrap: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    label: 'text-slate-500 dark:text-slate-400',
    trendGood: 'text-emerald-600 dark:text-emerald-400',
    trendBad: 'text-rose-600 dark:text-rose-400',
    sparkStroke: 'stroke-emerald-400',
    sparkFill: 'fill-emerald-400/10',
    symbolClass: 'text-sm opacity-50',
  },
  danger: {
    card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
    iconWrap: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    label: 'text-slate-500 dark:text-slate-400',
    trendGood: 'text-emerald-600 dark:text-emerald-400',
    trendBad: 'text-rose-600 dark:text-rose-400',
    sparkStroke: 'stroke-rose-400',
    sparkFill: 'fill-rose-400/10',
    symbolClass: 'text-sm opacity-50',
  },
  brand: {
    card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
    iconWrap: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    label: 'text-slate-500 dark:text-slate-400',
    trendGood: 'text-emerald-600 dark:text-emerald-400',
    trendBad: 'text-rose-600 dark:text-rose-400',
    sparkStroke: 'stroke-indigo-400',
    sparkFill: 'fill-indigo-400/10',
    symbolClass: 'text-sm opacity-50',
  },
}

function AnimatedAmount({ amount, symbolClass }) {
  const { user } = useAuth()
  const animated = useCountUp(amount)
  return (
    <>
      <span className={`${symbolClass} mr-1 font-medium`}>{getCurrencySymbol(user?.currency)}</span>
      {formatAmount(animated)}
    </>
  )
}

/**
 * A single financial KPI tile: icon, label, real animated amount, an
 * optional real month-over-month trend, and an optional sparkline built
 * from a real short series (e.g. the 6-month comparison). No fabricated
 * numbers - trend and sparkline are simply omitted when there isn't
 * enough real data to show them honestly.
 */
export default function KpiCard({
  icon: Icon,
  label,
  amount,
  trend,
  favorableWhenUp = true,
  sparklineValues,
  subtitle,
  progressPercent,
  tone = 'brand',
  maskable = false,
}) {
  const [hidden, setHidden] = useState(false)
  const t = TONES[tone] || TONES.brand
  const spark = sparklineValues && sparklineValues.length >= 2 ? computeSparkline(sparklineValues, { width: SPARK_WIDTH, height: SPARK_HEIGHT }) : null
  const trendGoodDirection = trend && (favorableWhenUp ? trend.up : !trend.up)

  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-5 shadow-sm ${t.card}`}>
      {tone === 'hero' && <div className="bm-gh-motif pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true" />}
      {spark?.area && (
        <svg
          viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full"
          aria-hidden="true"
        >
          <path d={spark.area} className={t.sparkFill} />
          <path d={spark.line} fill="none" className={t.sparkStroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${t.iconWrap}`} aria-hidden="true">
            <Icon size={16} />
          </span>
          <span className={`text-sm font-medium ${t.label}`}>{label}</span>
        </div>
        {maskable && (
          <button
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
            aria-pressed={hidden}
            className={`rounded-full p-1 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10 ${t.label}`}
          >
            {hidden ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
          </button>
        )}
      </div>

      <p className={`relative mt-3 text-2xl font-bold tabular-nums ${tone === 'hero' ? '' : 'text-slate-900 dark:text-white'}`}>
        {hidden ? MASK : <AnimatedAmount amount={amount} symbolClass={t.symbolClass} />}
      </p>

      {trend && (
        <p className={`relative mt-1 text-xs font-medium ${trendGoodDirection ? t.trendGood : t.trendBad}`}>
          {trend.up ? '↑' : '↓'} {trend.value}% vs last month
        </p>
      )}

      {subtitle && <p className={`relative mt-1 text-xs ${t.label}`}>{subtitle}</p>}

      <div className="relative flex-1" aria-hidden="true" />

      {progressPercent != null && (
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </div>
  )
}
