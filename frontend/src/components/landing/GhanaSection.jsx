import { Banknote, CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'

const ICONS = [Wallet, Smartphone, Landmark, Banknote, CreditCard]

export default function GhanaSection() {
  const { t } = useTranslation()
  const methods = t('ghana.methods', { returnObjects: true })

  return (
    <section className="border-t border-slate-100 py-16 dark:border-slate-800 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('ghana.heading')}</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">{t('ghana.description')}</p>
        </Reveal>

        <Reveal delay={100} className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {methods.map((label, i) => {
            const Icon = ICONS[i]
            return (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <Icon size={16} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                {label}
              </span>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
