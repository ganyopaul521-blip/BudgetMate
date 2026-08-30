import { BellRing, FileBarChart2, MapPin, PieChart, PiggyBank, Receipt } from 'lucide-react'
import Reveal from '../Reveal'
import FeatureCard from './FeatureCard'

const FEATURES = [
  {
    icon: Receipt,
    title: 'Track Every Transaction',
    description: 'Record income and expenses quickly and keep your financial activity organized.',
  },
  {
    icon: PiggyBank,
    title: 'Smart Budgeting',
    description: 'Set monthly spending limits and monitor your progress by category.',
  },
  {
    icon: PieChart,
    title: 'Spending Insights',
    description: 'Understand where your money goes through clear charts and financial summaries.',
  },
  {
    icon: BellRing,
    title: 'Budget Alerts',
    description: 'Receive timely notifications when your spending approaches or exceeds your budget.',
  },
  {
    icon: FileBarChart2,
    title: 'Financial Reports',
    description: 'Turn your transaction history into useful financial insights.',
  },
  {
    icon: MapPin,
    title: 'Built for Ghana',
    description: 'Support for Ghana Cedi and payment methods commonly used by Ghanaian users, including Mobile Money.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Everything you need to stay financially in control
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            No clutter, no subscriptions — just the tools that actually change how you spend.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  )
}
