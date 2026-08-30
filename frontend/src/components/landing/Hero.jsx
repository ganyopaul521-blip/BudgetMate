import { ArrowRight, ChevronDown, Shield, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../Badge'
import Button from '../Button'
import Reveal from '../Reveal'
import HeroImage from './HeroImage'

export default function Hero({ isAuthed }) {
  return (
    <section id="top" className="scroll-mt-16 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Badge tone="info" icon={Wallet}>
            Built for students & young professionals in Ghana
          </Badge>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Take control of your money.
            <br />
            Build better financial habits.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-500 dark:text-slate-400">
            BudgetMate makes it simple to track your spending, manage your budget, and understand where your money
            goes — all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthed ? (
              <Button as={Link} to="/dashboard" size="lg" rightIcon={ArrowRight}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button as={Link} to="/register" size="lg" rightIcon={ArrowRight}>
                  Get Started
                </Button>
                <Button as="a" href="#features" size="lg" variant="secondary" rightIcon={ChevronDown}>
                  Explore BudgetMate
                </Button>
              </>
            )}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield size={15} aria-hidden="true" /> Free to use, no card required
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet size={15} aria-hidden="true" /> Built in Ghana Cedi (GH₵)
            </span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <HeroImage />
        </Reveal>
      </div>
    </section>
  )
}
