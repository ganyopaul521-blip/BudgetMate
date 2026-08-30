import { KeyRound, Lock, ShieldCheck, TimerReset } from 'lucide-react'
import Reveal from '../Reveal'

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Secure authentication',
    description: 'Passwords are hashed, never stored in plain text, and sessions expire automatically after a period of inactivity.',
  },
  {
    icon: Lock,
    title: 'Private financial information',
    description: 'Your transactions, budgets, and reports are tied to your account and only visible when you\'re signed in.',
  },
  {
    icon: KeyRound,
    title: 'Controlled access',
    description: 'Every request to your data requires a valid, signed session — there\'s no shared or anonymous access.',
  },
  {
    icon: TimerReset,
    title: 'Responsible data handling',
    description: 'Password reset links expire after an hour, and inactive sessions are ended automatically rather than left open.',
  },
]

export default function SecuritySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your finances deserve clarity and care.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 60} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
