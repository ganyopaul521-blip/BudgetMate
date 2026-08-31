import { useTranslation } from 'react-i18next'
import Badge from '../Badge'
import Card from '../Card'
import Reveal from '../Reveal'

const MONTHS = [
  { income: 70, expense: 48 },
  { income: 82, expense: 60 },
  { income: 76, expense: 55 },
  { income: 100, expense: 58 },
]

const CATEGORY_META = [
  { pct: 32, tone: 'bg-indigo-600' },
  { pct: 26, tone: 'bg-indigo-500' },
  { pct: 18, tone: 'bg-indigo-400' },
  { pct: 14, tone: 'bg-indigo-300' },
  { pct: 10, tone: 'bg-slate-300 dark:bg-slate-600' },
]

export default function InsightsSection() {
  const { t } = useTranslation()
  const monthLabels = t('insights.monthLabels', { returnObjects: true, defaultValue: ['May', 'Jun', 'Jul', 'Aug'] })
  const categoryLabels = t('insights.categoryLabels', { returnObjects: true })

  return (
    <section id="insights" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('insights.heading')}</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">{t('insights.description')}</p>
          </Reveal>

          <Reveal delay={120}>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('insights.chartTitle')}</h3>
                <Badge tone="neutral">{t('insights.illustrative')}</Badge>
              </div>
              <div className="flex h-32 items-end justify-between gap-3" role="img" aria-label={t('insights.chartAlt')}>
                {MONTHS.map((m, i) => (
                  <div key={monthLabels[i]} className="flex flex-1 flex-col items-center gap-1.5">
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
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{monthLabels[i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> {t('insights.income')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" aria-hidden="true" /> {t('insights.expenses')}
                </span>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('insights.spendingByCategory')}</h3>
                {CATEGORY_META.map((c, i) => (
                  <div key={categoryLabels[i]} className="flex items-center gap-2.5 text-xs">
                    <span className="w-28 shrink-0 text-slate-500 dark:text-slate-400">{categoryLabels[i]}</span>
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
