import { Check, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import DashboardPreview from './landing/DashboardPreview'
import ThemeToggle from './ThemeToggle'

export default function AuthLayout({ title, subtitle, children }) {
  const { t } = useTranslation()
  const benefits = t('auth.layout.benefits', { returnObjects: true })

  return (
    <div className="relative flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 px-12 py-14 text-white shadow-[12px_0_40px_-16px_rgba(67,56,202,0.5)] lg:flex xl:px-16">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 shadow-inner">
            <Wallet size={19} />
          </div>
          <div>
            <span className="block text-xl leading-tight">BudgetMate</span>
            <span className="block text-xs font-normal text-indigo-200">{t('auth.layout.tagline')}</span>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">{t('auth.layout.headline')}</h2>
          <p className="mt-3 max-w-sm text-indigo-100">{t('auth.layout.description')}</p>
          <ul className="mt-8 space-y-4">
            {benefits.map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 shadow-inner">
                  <Check size={15} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-10 hidden max-w-xs xl:block" aria-hidden="true">
            <div className="pointer-events-none scale-95 origin-top">
              <DashboardPreview variant="compact" glass />
            </div>
          </div>
        </div>

        <p className="relative text-xs text-indigo-200">{t('auth.layout.copyright', { year: new Date().getFullYear() })}</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm lg:hidden">
              <Wallet size={22} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
