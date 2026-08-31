import { CheckCircle2, TrendingDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import dashboardTabletImage from '../../assets/images/dashboard-tablet.jpg'

/**
 * Hero product visual: a real photo of a financial dashboard on a tablet,
 * framed like a premium product shot with two small floating stat cards
 * that visually tie it back to BudgetMate. The stat values are purely
 * illustrative, not real user data.
 */
export default function HeroImage() {
  const { t } = useTranslation()

  return (
    <div className="relative mx-auto max-w-sm lg:max-w-none">
      <div
        className="animate-glow-pulse absolute -inset-6 -z-10 rounded-[2rem] bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800">
        <img
          src={dashboardTabletImage}
          alt={t('heroImage.alt')}
          width={736}
          height={1104}
          fetchPriority="high"
          className="h-auto w-full"
        />
      </div>

      <div className="animate-float absolute bottom-3 left-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:-bottom-5 sm:-left-6 sm:px-4 sm:py-3 lg:-bottom-6 lg:-left-8">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 sm:h-10 sm:w-10">
          <CheckCircle2 size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{t('heroImage.budgetHealth')}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{t('heroImage.onTrack')}</p>
        </div>
      </div>

      <div className="animate-float-delayed absolute right-3 top-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:-right-5 sm:-top-4 sm:px-3.5 sm:py-2.5 lg:-right-6">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 sm:h-8 sm:w-8">
          <TrendingDown size={14} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('heroImage.thisMonth')}</p>
          <p className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">{t('heroImage.spent')}</p>
        </div>
      </div>
    </div>
  )
}
