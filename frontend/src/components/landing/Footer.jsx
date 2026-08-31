import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const LINK_GROUPS = [
    {
      heading: t('footer.product'),
      links: [
        { label: t('footer.features'), href: '#features' },
        { label: t('footer.howItWorks'), href: '#how-it-works' },
        { label: t('footer.reports'), href: '#insights' },
      ],
    },
    {
      heading: t('footer.company'),
      links: [
        { label: t('footer.about'), href: '#about' },
        { label: t('footer.contact') },
      ],
    },
    {
      heading: t('footer.support'),
      links: [
        { label: t('footer.help'), href: '#faq' },
        { label: t('footer.faq'), href: '#faq' },
        { label: t('footer.privacy') },
      ],
    },
  ]

  return (
    <footer className="border-t border-slate-100 py-12 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Wallet size={17} aria-hidden="true" />
              </div>
              <span className="text-lg">BudgetMate</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('footer.tagline')}</p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{group.heading}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400 dark:text-slate-600">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p>{t('footer.project')}</p>
        </div>
      </div>
    </footer>
  )
}
