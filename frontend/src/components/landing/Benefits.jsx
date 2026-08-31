import { Compass, Eye, ShieldCheck, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import Reveal from '../Reveal'

const ICONS = [Eye, ShieldCheck, TrendingUp, Compass]

export default function Benefits() {
  const { t } = useTranslation()
  const items = t('benefits.items', { returnObjects: true })

  return (
    <section id="benefits" className="scroll-mt-20 border-t border-slate-100 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('benefits.heading')}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, description }, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal key={title} delay={i * 60}>
                <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
