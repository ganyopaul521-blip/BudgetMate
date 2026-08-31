import { BellRing, FileBarChart2, MapPin, PieChart, PiggyBank, Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'
import FeatureCard from './FeatureCard'

const ICONS = [Receipt, PiggyBank, PieChart, BellRing, FileBarChart2, MapPin]

export default function FeaturesSection() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })

  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('features.heading')}</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">{t('features.subheading')}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => (
            <FeatureCard key={feature.title} icon={ICONS[i]} title={feature.title} description={feature.description} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  )
}
