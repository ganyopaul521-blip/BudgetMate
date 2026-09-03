import { HeartPulse } from 'lucide-react'
import Card from './Card'
import EmptyState from './EmptyState'
import ProgressBar from './ProgressBar'

/**
 * Computes a Financial Health score purely from real data already on the
 * dashboard - no fabricated metrics. Each sub-score only appears when there's
 * enough real data behind it (budgets set, income logged this month); the
 * overall score averages whichever sub-scores are actually available.
 */
export function computeFinancialHealth({ totalIncome, totalExpense, budgetStatus }) {
  const parts = []

  if (budgetStatus.length > 0) {
    const avg =
      budgetStatus.reduce((sum, b) => sum + Math.max(0, 100 - Math.max(0, b.percentUsed - 100)), 0) / budgetStatus.length
    parts.push({ key: 'budgetDiscipline', label: 'Budget discipline', score: Math.round(avg) })
  }

  if (totalIncome > 0) {
    const spendRatio = totalExpense / totalIncome
    parts.push({
      key: 'spendingControl',
      label: 'Spending control',
      score: Math.max(0, Math.min(100, Math.round(100 - spendRatio * 100))),
    })

    const savingsRate = (totalIncome - totalExpense) / totalIncome
    parts.push({
      key: 'savingsProgress',
      label: 'Savings progress',
      score: Math.max(0, Math.min(100, Math.round(savingsRate * 100))),
    })
  }

  if (parts.length === 0) return null

  const overall = Math.round(parts.reduce((sum, p) => sum + p.score, 0) / parts.length)
  return { overall, parts }
}

function scoreMessage(overall) {
  if (overall >= 80) return "You're staying within your planned spending."
  if (overall >= 50) return "You're managing okay, with some room to tighten up."
  return 'Your spending is outpacing your income or budgets this month.'
}

function barTone(score) {
  if (score >= 80) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
}

const RING_STROKE_BY_TONE = {
  success: 'stroke-emerald-500 dark:stroke-emerald-400',
  warning: 'stroke-amber-500 dark:stroke-amber-400',
  danger: 'stroke-rose-500 dark:stroke-rose-400',
}

function HealthGauge({ score }) {
  const size = 104
  const strokeWidth = 9
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(score, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative mx-auto shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Financial health score: ${clamped} out of 100`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={RING_STROKE_BY_TONE[barTone(clamped)]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{clamped}</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 100</span>
      </div>
    </div>
  )
}

export default function FinancialHealth({ totalIncome, totalExpense, budgetStatus }) {
  const health = computeFinancialHealth({ totalIncome, totalExpense, budgetStatus })

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Financial Health</h2>
      {!health ? (
        <EmptyState
          icon={HeartPulse}
          title="No Data Yet"
          description="Log income or expenses this month, or set a budget, to see your Financial Health score."
        />
      ) : (
        <div>
          <HealthGauge score={health.overall} />
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">{scoreMessage(health.overall)}</p>

          <div className="mt-5 space-y-3">
            {health.parts.map((p) => (
              <div key={p.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{p.label}</span>
                  <span className="text-slate-400 dark:text-slate-500">{p.score}%</span>
                </div>
                <ProgressBar percent={p.score} tone={barTone(p.score)} size="sm" label={p.label} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
