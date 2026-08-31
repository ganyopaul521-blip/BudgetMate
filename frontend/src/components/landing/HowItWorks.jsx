import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Check,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Utensils,
  Wallet2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReveal } from '../../hooks/useReveal'
import Badge from '../Badge'
import Card from '../Card'
import ProgressBar from '../ProgressBar'
import Reveal from '../Reveal'

const TRANSACTION_AMOUNTS = [-45, -25, 350]

function TransactionsVisual() {
  const { t } = useTranslation()
  const transactions = t('dashboardPreview.transactions', { returnObjects: true })

  return (
    <Card className="mx-auto max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('dashboardPreview.recentTransactions')}</h4>
        <Badge tone="neutral">{t('dashboardPreview.preview')}</Badge>
      </div>
      <div className="space-y-3">
        {transactions.map((tx, i) => {
          const isIncome = TRANSACTION_AMOUNTS[i] > 0
          const Icon = isIncome ? ArrowDownLeft : ArrowUpRight
          return (
            <div key={tx.label} className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isIncome
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
                }`}
              >
                <Icon size={15} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{tx.label}</p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">{tx.category}</p>
              </div>
              <span
                className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
              >
                {isIncome ? '+' : '-'}GH₵ {Math.abs(TRANSACTION_AMOUNTS[i]).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

const CHART_POINTS = '0,90 40,62 80,76 120,46 160,52 200,22 240,32'
const CHART_AREA = `${CHART_POINTS} 240,120 0,120`

function CashflowVisual() {
  const { t } = useTranslation()
  const [ref, visible] = useReveal()

  return (
    <div ref={ref} className="mx-auto max-w-sm">
      <Card>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <Wallet2 size={16} aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('dashboardPreview.thisMonth')}</p>
        </div>

        <div className="relative">
          <svg viewBox="0 0 240 120" className="h-36 w-full" preserveAspectRatio="none" aria-hidden="true">
            <polygon points={CHART_AREA} className="fill-indigo-500/10 dark:fill-indigo-400/10" />
            <polyline
              points={CHART_POINTS}
              fill="none"
              className="stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 400,
                strokeDashoffset: visible ? 0 : 400,
                transition: 'stroke-dashoffset 1.1s ease-out',
              }}
            />
          </svg>

          <div className="absolute bottom-2 right-2 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div className="text-right">
                <p className="text-[9px] font-medium leading-tight text-slate-400 dark:text-slate-500">{t('howItWorks.currentBalance')}</p>
                <p className="text-xs font-bold leading-tight tabular-nums text-emerald-600 dark:text-emerald-400">+GH₵ 6,489.00</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <TrendingDown size={13} className="text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <div className="text-right">
                <p className="text-[9px] font-medium leading-tight text-slate-400 dark:text-slate-500">{t('howItWorks.monthlyCashflow')}</p>
                <p className="text-xs font-bold leading-tight tabular-nums text-rose-600 dark:text-rose-400">-GH₵ 1,584.00</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function BudgetsVisual() {
  const { t } = useTranslation()
  const [ref, visible] = useReveal()
  const categoryLabels = t('insights.categoryLabels', { returnObjects: true })

  const items = [
    { icon: Utensils, label: categoryLabels[1], amount: 'GH₵ 420.00', pct: 62, tone: 'brand' },
    { icon: Car, label: categoryLabels[2], amount: 'GH₵ 1,367.00', pct: 50, tone: 'warning' },
    { icon: Smartphone, label: categoryLabels[3], amount: 'GH₵ 2,795.00', pct: 31, tone: 'success' },
  ]

  return (
    <div ref={ref} className="mx-auto max-w-sm space-y-3">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <item.icon size={15} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">{item.amount}</span>
          </div>
          <ProgressBar percent={visible ? item.pct : 0} tone={item.tone} label={`${item.label} spending`} />
        </Card>
      ))}
    </div>
  )
}

const VISUALS = [TransactionsVisual, CashflowVisual, BudgetsVisual]

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('howItWorks.heading')}</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">{t('howItWorks.subheading')}</p>
        </Reveal>

        <div className="mt-16 space-y-20 sm:space-y-24">
          {steps.map((step, i) => {
            const Visual = VISUALS[i]
            const reversed = i % 2 === 1
            return (
              <div key={step.title} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={`relative overflow-hidden ${reversed ? 'lg:order-2' : ''}`}>
                  <span
                    aria-hidden="true"
                    className="absolute -top-8 right-0 select-none text-[7rem] font-black leading-none text-indigo-50 dark:text-white/5 sm:text-[9rem]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{step.eyebrow}</span>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{step.title}</h3>
                    <ul className="mt-6 space-y-4">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                            <Check size={12} aria-hidden="true" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={120} className={reversed ? 'lg:order-1' : ''}>
                  <Visual />
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
