import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'
import BrowserFrame from './BrowserFrame'
import DashboardPreview from './DashboardPreview'

export default function ProductShowcase() {
  const { t } = useTranslation()
  const points = t('productShowcase.points', { returnObjects: true })

  return (
    <section className="border-t border-slate-100 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <BrowserFrame>
              <DashboardPreview variant="full" />
            </BrowserFrame>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('productShowcase.heading')}</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">{t('productShowcase.description')}</p>
            <ul className="mt-6 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
