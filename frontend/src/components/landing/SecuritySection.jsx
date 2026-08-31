import { KeyRound, Lock, ShieldCheck, TimerReset } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'

const ICONS = [ShieldCheck, Lock, KeyRound, TimerReset]

export default function SecuritySection() {
  const { t } = useTranslation()
  const items = t('security.items', { returnObjects: true })

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('security.heading')}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map(({ title, description }, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal key={title} delay={i * 60} className="group flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
