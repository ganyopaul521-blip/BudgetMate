import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CreditCard,
  Menu,
  PieChart,
  PiggyBank,
  Receipt,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'

const FEATURES = [
  {
    icon: Receipt,
    title: 'Track every transaction',
    description: 'Log income and expenses in Ghana Cedi, tagged by category and payment method — including Mobile Money.',
  },
  {
    icon: PiggyBank,
    title: 'Set monthly budgets',
    description: 'Put a GH₵ limit on any category and watch a live progress bar as you spend through the month.',
  },
  {
    icon: AlertTriangle,
    title: 'Real-time overspend alerts',
    description: 'Get warned automatically at 80% of a budget, and again if you exceed it — before it becomes a problem.',
  },
  {
    icon: PieChart,
    title: 'Visual spending reports',
    description: 'Pie charts, 6-month trends, and monthly summaries make it obvious where your money actually goes.',
  },
  {
    icon: CreditCard,
    title: 'Real payments, built in',
    description: 'Pay bills and vendors directly through the app via Paystack — Mobile Money or card — with a budget check before you confirm.',
  },
  {
    icon: Bot,
    title: 'AI spending assistant',
    description: 'Ask for a personalised spending plan based on your real income and expenses, or get help using any part of the app.',
  },
]

const STEPS = [
  { title: 'Create your free account', description: 'Sign up in seconds — no card required, ever.' },
  { title: 'Log your income & expenses', description: 'Add transactions as they happen, or catch up in bulk.' },
  { title: 'Set budgets and stay ahead', description: 'Get alerts before you overspend, and clear reports on where you stand.' },
]

function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Wallet size={17} />
          </div>
          <span className="text-lg">BudgetMate</span>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <Button as={Link} to="/login" variant="ghost">
            Log In
          </Button>
          <Button as={Link} to="/register" rightIcon={ArrowRight}>
            Get Started Free
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:hidden">
          <Button as={Link} to="/login" variant="secondary" fullWidth>
            Log In
          </Button>
          <Button as={Link} to="/register" fullWidth rightIcon={ArrowRight}>
            Get Started Free
          </Button>
        </div>
      )}
    </header>
  )
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">This Month</span>
        <Badge tone="success">On track</Badge>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 3,200.00</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <TrendingDown size={14} aria-hidden="true" />
            <span className="text-xs font-medium">Expenses</span>
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">GH₵ 1,840.00</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Food & Groceries', pct: 62, tone: 'bg-emerald-500' },
          { label: 'Data & Airtime', pct: 88, tone: 'bg-amber-500' },
          { label: 'Transport', pct: 104, tone: 'bg-rose-500' },
        ].map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">{b.label}</span>
              <span className="text-slate-400 dark:text-slate-500">{b.pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full ${b.tone}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-400">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Transport</strong> is over budget by GH₵ 20.00
        </span>
      </div>

      <div className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
        <Bot size={22} />
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <PublicHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="info" icon={Sparkles}>
              Free, forever &middot; Built for Ghana
            </Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Take control of your money, on your terms.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500 dark:text-slate-400">
              BudgetMate is a free personal budget tracker built for students and young professionals in Ghana —
              track spending in Ghana Cedi, manage Mobile Money, get real-time overspend alerts, and see exactly
              where your money goes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/register" size="lg" rightIcon={ArrowRight}>
                Get Started Free
              </Button>
              <Button as={Link} to="/login" size="lg" variant="secondary">
                Log In
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield size={15} aria-hidden="true" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet size={15} aria-hidden="true" /> Built in Ghana Cedi (GH₵)
              </span>
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to stay on budget</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              No clutter, no subscriptions — just the tools that actually change how you spend.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Get started in three steps</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-indigo-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to take control of your finances?</h2>
          <p className="mt-3 text-indigo-100">Join BudgetMate today — it's free, and built for how you actually spend.</p>
          <Button as={Link} to="/register" size="lg" variant="secondary" rightIcon={ArrowRight} className="mt-7">
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 dark:text-slate-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
            <Wallet size={16} aria-hidden="true" /> BudgetMate
          </div>
          <p>&copy; {new Date().getFullYear()} BudgetMate &middot; Built for the University of Ghana final year project.</p>
        </div>
      </footer>
    </div>
  )
}
