import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../Reveal'

export default function FAQSection() {
  const { t } = useTranslation()
  const faqs = t('faq.items', { returnObjects: true })

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('faq.heading')}</h2>
        </Reveal>

        <Reveal delay={80} className="mt-10 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {faqs.map((faq) => (
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
