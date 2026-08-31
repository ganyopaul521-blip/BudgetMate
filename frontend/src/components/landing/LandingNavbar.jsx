import { ArrowRight, Menu, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../Button'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'

export default function LandingNavbar({ isAuthed }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const NAV_LINKS = [
    { href: '#top', label: t('nav.home') },
    { href: '#features', label: t('nav.features') },
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#benefits', label: t('nav.benefits') },
    { href: '#faq', label: t('nav.faq') },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Wallet size={17} aria-hidden="true" />
          </div>
          <span className="text-lg">BudgetMate</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={t('nav.sectionsAriaLabel')}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthed ? (
            <Button as={Link} to="/dashboard" rightIcon={ArrowRight}>
              {t('nav.goToDashboard')}
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">
                {t('nav.login')}
              </Button>
              <Button as={Link} to="/register" rightIcon={ArrowRight}>
                {t('nav.getStarted')}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="landing-mobile-menu" className="border-t border-slate-100 px-4 py-3 dark:border-slate-800 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label={t('nav.sectionsAriaLabel')}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {isAuthed ? (
              <Button as={Link} to="/dashboard" fullWidth rightIcon={ArrowRight} onClick={() => setOpen(false)}>
                {t('nav.goToDashboard')}
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary" fullWidth onClick={() => setOpen(false)}>
                  {t('nav.login')}
                </Button>
                <Button as={Link} to="/register" fullWidth rightIcon={ArrowRight} onClick={() => setOpen(false)}>
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
