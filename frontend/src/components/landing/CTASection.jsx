import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../Button'
import Reveal from '../Reveal'

export default function CTASection({ isAuthed, userFirstName }) {
  return (
    <section className="border-t border-slate-100 bg-indigo-700 py-16 dark:border-slate-800">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {isAuthed ? (
          <>
            <h2 className="text-3xl font-bold text-white">Welcome back{userFirstName ? `, ${userFirstName}` : ''}.</h2>
            <p className="mt-3 text-indigo-100">Jump back in and see where your money stands this month.</p>
            <Button as={Link} to="/dashboard" size="lg" variant="secondary" rightIcon={ArrowRight} className="mt-7">
              Go to Dashboard
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white">Ready to take control of your money?</h2>
            <p className="mt-3 text-indigo-100">Start tracking, budgeting, and understanding your finances with BudgetMate.</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button as={Link} to="/register" size="lg" variant="secondary" rightIcon={ArrowRight}>
                Get Started — It's Simple
              </Button>
              <Link
                to="/login"
                className="rounded-lg px-5 py-3 text-base font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Log In
              </Link>
            </div>
          </>
        )}
      </Reveal>
    </section>
  )
}
