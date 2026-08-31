import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../Button'
import Reveal from '../Reveal'

export default function CTASection({ isAuthed, userFirstName }) {
  const { t } = useTranslation()

  return (
    <section className="border-t border-slate-100 bg-indigo-700 py-16 dark:border-slate-800">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {isAuthed ? (
          <>
            <h2 className="text-3xl font-bold text-white">
              {t('cta.welcomeBack', { name: userFirstName ? `, ${userFirstName}` : '' })}
            </h2>
            <p className="mt-3 text-indigo-100">{t('cta.welcomeBackSubtitle')}</p>
            <Button as={Link} to="/dashboard" size="lg" variant="secondary" rightIcon={ArrowRight} className="mt-7">
              {t('cta.goToDashboard')}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white">{t('cta.heading')}</h2>
            <p className="mt-3 text-indigo-100">{t('cta.subtitle')}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button as={Link} to="/register" size="lg" variant="secondary" rightIcon={ArrowRight}>
                {t('cta.getStarted')}
              </Button>
              <Link
                to="/login"
                className="rounded-lg px-5 py-3 text-base font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t('cta.login')}
              </Link>
            </div>
          </>
        )}
      </Reveal>
    </section>
  )
}
