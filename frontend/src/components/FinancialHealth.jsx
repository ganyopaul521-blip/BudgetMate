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

export default function FinancialHealth({ totalIncome, totalExpense, budgetStatus }) {
  const health = computeFinancialHealth({ totalIncome, totalExpense, budgetStatus })

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Financial Health</h2>
      {!health ? (
        <EmptyState
          icon={HeartPulse}
          title="Not enough data yet"
          description="Log income or expenses this month, or set a budget, to see your Financial Health score."
        />
      ) : (
        <div>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">{health.overall}</span>
            <span className="mb-1 text-sm text-slate-400 dark:text-slate-500">/ 100</span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{scoreMessage(health.overall)}</p>

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
