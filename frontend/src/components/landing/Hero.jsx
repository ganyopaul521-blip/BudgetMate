import { ArrowRight, ChevronDown, Shield, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Badge from '../Badge'
import Button from '../Button'
import Reveal from '../Reveal'
import HeroImage from './HeroImage'

export default function Hero({ isAuthed }) {
  const { t } = useTranslation()

  return (
    <section id="top" className="relative isolate scroll-mt-16 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      <HeroImage />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <Badge tone="info" icon={Wallet}>
            {t('hero.badge')}
          </Badge>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t('hero.headlineLine1')}
            <br />
            {t('hero.headlineLine2')}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-500 dark:text-slate-400">{t('hero.description')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthed ? (
              <Button as={Link} to="/dashboard" size="lg" rightIcon={ArrowRight}>
                {t('hero.goToDashboard')}
              </Button>
            ) : (
              <>
                <Button as={Link} to="/register" size="lg" rightIcon={ArrowRight}>
                  {t('hero.getStarted')}
                </Button>
                <Button as="a" href="#features" size="lg" variant="secondary" rightIcon={ChevronDown}>
                  {t('hero.explore')}
                </Button>
              </>
            )}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield size={15} aria-hidden="true" /> {t('hero.freeNoCard')}
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet size={15} aria-hidden="true" /> {t('hero.builtInGhs')}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
