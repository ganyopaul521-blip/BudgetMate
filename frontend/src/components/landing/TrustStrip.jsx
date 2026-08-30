import { Check } from 'lucide-react'
import Reveal from '../Reveal'

const POINTS = [
  'Simple expense tracking',
  'Smart budgeting',
  'Clear financial insights',
  'Built with Ghanaian users in mind',
]

export default function TrustStrip() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-8 dark:border-slate-800 dark:bg-slate-900/40">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          Everything you need to make smarter financial decisions
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {POINTS.map((point) => (
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
