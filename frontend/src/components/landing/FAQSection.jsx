import { ChevronDown } from 'lucide-react'
import Reveal from '../Reveal'

const FAQS = [
  {
    question: 'Is BudgetMate free to use?',
    answer: 'Yes. Creating an account and using the core budgeting, tracking, and reporting features is free.',
  },
  {
    question: 'Does it support Mobile Money?',
    answer: 'Yes — Mobile Money is one of the payment methods you can log transactions against, alongside cash, bank transfers, and cards.',
  },
  {
    question: 'Is my financial data private?',
    answer: 'Your transactions, budgets, and reports are tied to your account and only accessible once you\'re signed in.',
  },
  {
    question: 'Can I use BudgetMate on my phone?',
    answer: 'Yes — the app is fully responsive and works in any modern mobile browser, no separate app install needed.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Frequently asked questions</h2>
        </Reveal>

        <Reveal delay={80} className="mt-10 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group px-5 py-4 open:pb-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-800 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-100">
                {faq.question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 dark:text-slate-500"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{faq.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
