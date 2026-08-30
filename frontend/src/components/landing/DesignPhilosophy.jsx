import { Eye, Receipt, TrendingDown } from 'lucide-react'
import Card from '../Card'
import Reveal from '../Reveal'

const CHALLENGES = [
  {
    icon: Receipt,
    title: 'Small expenses add up unnoticed',
    description: 'A few cedis here and there on data, transport, or food rarely feels significant in the moment.',
  },
  {
    icon: TrendingDown,
    title: 'Overspending is realised too late',
    description: 'Without a running total, it\'s easy to only notice a budget is blown after the fact.',
  },
  {
    icon: Eye,
    title: 'Monthly habits stay invisible',
    description: 'Bank and Mobile Money statements show transactions — rarely a clear picture of where it all went.',
  },
]

export default function DesignPhilosophy() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-slate-100 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed around real budgeting challenges
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            BudgetMate was built around problems students and young professionals actually run into when managing
            money day to day.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CHALLENGES.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 80}>
              <Card className="h-full">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
