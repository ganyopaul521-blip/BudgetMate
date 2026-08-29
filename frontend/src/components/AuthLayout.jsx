import { BarChart3, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

const FEATURES = [
  { icon: BarChart3, text: 'Visual spending reports and budget tracking' },
  { icon: ShieldCheck, text: 'Real-time alerts before you overspend' },
  { icon: Sparkles, text: 'AI-powered spending guidance, built for Ghana' },
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden w-[42%] flex-col justify-between bg-indigo-700 px-10 py-12 text-white lg:flex xl:px-14">
        <div className="flex items-center gap-2.5 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <Wallet size={19} />
          </div>
          <span className="text-xl">BudgetMate</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">Take control of your money, on your terms.</h2>
          <p className="mt-3 max-w-sm text-indigo-100">
            Built for students and young professionals in Ghana — track spending in Ghana Cedi, manage Mobile Money, and stay ahead of your budget.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon size={15} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-indigo-200">&copy; {new Date().getFullYear()} BudgetMate. Built for the University of Ghana final year project.</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white lg:hidden">
              <Wallet size={22} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
