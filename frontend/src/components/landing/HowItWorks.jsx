import Reveal from '../Reveal'

const STEPS = [
  { number: '01', title: 'Create your account', description: 'Sign up in seconds — no card required, ever.' },
  { number: '02', title: 'Track your income and expenses', description: 'Log transactions as they happen, or catch up in bulk.' },
  { number: '03', title: 'Set your budgets', description: 'Put a GH₵ limit on any category and keep an eye on it.' },
  {
    number: '04',
    title: 'Understand your spending and improve your habits',
    description: 'Use alerts and reports to spot patterns before they become problems.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Managing your money can be this simple.
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-5 hidden h-px bg-slate-200 dark:bg-slate-800 lg:block"
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} as="li" delay={i * 80} className="text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-50 bg-indigo-600 text-sm font-bold text-white dark:border-slate-950">
                  {step.number}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
