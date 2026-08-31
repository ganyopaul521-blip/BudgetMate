import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'

export default function TrustStrip() {
  const { t } = useTranslation()
  const points = t('trustStrip.points', { returnObjects: true })

  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-8 dark:border-slate-800 dark:bg-slate-900/40">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">{t('trustStrip.heading')}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Check size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
