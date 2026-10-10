import { ArrowLeft, Mail, MessageCircle, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import accraSkyline from '../assets/images/accra-skyline.jpg'
import Footer from '../components/landing/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeToggle from '../components/ThemeToggle'

const CONTACT_EMAIL = 'ganyopaul521@gmail.com'
const WHATSAPP_DISPLAY = '+233 24 541 6445'
const WHATSAPP_LINK = 'https://wa.me/233245416445'
const LAST_UPDATED = 'October 10, 2026'

function Section({ title, children }) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="space-y-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  )
}

export default function Privacy() {
  return (
    <div className="bm-landing relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] overflow-hidden" aria-hidden="true">
        <img
          src={accraSkyline}
          alt=""
          className="absolute right-0 top-0 h-full w-full max-w-5xl object-cover object-[65%_30%] opacity-[0.45] dark:opacity-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Wallet size={17} aria-hidden="true" />
            </div>
            <span className="text-lg">BudgetMate</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to home
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Last updated: {LAST_UPDATED}</p>

        <p className="mt-6 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          BudgetMate is a personal budget tracker built for students and young professionals in Ghana, developed by
          Paul Ganyo. This page explains, in plain language, what information the application collects when you use
          it, why it is collected, who it is shared with, and how you can reach us with questions or requests.
        </p>

        <Section title="1. Information we collect">
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Account information.</strong> When you register, we
            store your full name, email address and a securely hashed version of your password. We never store your
            password in plain text. If you sign in with Google, we store your Google account identifier instead, and
            no password is created. You may also add a profile picture and choose a preferred display currency.
          </p>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Financial information you enter.</strong> BudgetMate
            does not connect to your bank or mobile money account. Every transaction, budget and category you see in
            the app is information you typed in yourself, together with the date it was recorded.
          </p>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Payment records.</strong> If you make an in-app
            payment, it is processed by Paystack. BudgetMate keeps a record of the amount, category, channel (card or
            mobile money), status and Paystack's transaction reference. We do not collect or store your card number,
            card expiry date, CVV or mobile money PIN at any point — those details are entered directly into
            Paystack's own secure checkout, not into BudgetMate.
          </p>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Assistant conversations.</strong> If you use the
            built-in chat assistant, the message you type is sent, together with a summary of your current month's
            income and spending, to Google's Gemini service so it can generate a relevant reply.
          </p>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Technical information.</strong> Your session token,
            and your chosen theme and language, are stored in your browser's local storage so you stay signed in and
            your preferences are remembered. This stays on your device; it is not a tracking cookie, and BudgetMate
            does not use advertising or analytics trackers.
          </p>
        </Section>

        <Section title="2. How we use your information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To create and secure your account, and to keep you signed in between visits.</li>
            <li>To record, display and summarise the transactions and budgets you add.</li>
            <li>To calculate budget alerts, reports and your financial health score from your own figures.</li>
            <li>To process payments you choose to make through Paystack, and record the result.</li>
            <li>To send you a password-reset link by email, only when you request one.</li>
            <li>To answer questions you ask the in-app assistant, using your own financial data as context.</li>
          </ul>
          <p>We do not use your information for advertising, and we do not sell personal data to third parties.</p>
        </Section>

        <Section title="3. Who we share information with">
          <p>
            BudgetMate relies on a small number of trusted service providers to operate. Each sees only the
            information it needs to do its specific job:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-slate-800 dark:text-slate-100">Google</strong> — to verify Google sign-in, and to power the chat assistant (Gemini).</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Paystack</strong> — to process card and mobile money payments.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Brevo</strong> — to deliver password-reset emails.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Vercel, Render and MongoDB Atlas</strong> — the cloud providers that host the application and its database.</li>
          </ul>
          <p>
            Each of these providers has its own privacy policy governing the data it processes on BudgetMate's behalf.
            We do not share your information with anyone else, except where required by law.
          </p>
        </Section>

        <Section title="4. Data security">
          <p>
            Passwords are hashed with bcrypt before storage and are never stored or logged in plain text. All traffic
            between your device and BudgetMate's servers is encrypted (HTTPS/TLS). Sessions use signed tokens that
            automatically expire after 30 minutes of inactivity. While no system can guarantee absolute security, we
            take reasonable, industry-standard steps to protect your information.
          </p>
        </Section>

        <Section title="5. Data retention and deletion">
          <p>
            We keep your account and financial records for as long as your account remains active, so that your
            history, budgets and reports stay available to you. BudgetMate does not currently have a self-service
            "delete my account" button in the app. If you would like your account and the data associated with it
            permanently deleted, contact us using the details below and we will act on your request.
          </p>
        </Section>

        <Section title="6. Your choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>You can update your name, email address, display currency and profile picture at any time from Settings.</li>
            <li>You can delete individual transactions, budgets or custom categories you created.</li>
            <li>You can choose not to use the in-app payment or assistant features; the rest of BudgetMate works without them.</li>
            <li>You can ask us, by email or WhatsApp, what information we hold about you, or to have it corrected or deleted.</li>
          </ul>
        </Section>

        <Section title="7. Changes to this policy">
          <p>
            If this policy changes, we will update the date at the top of this page. Significant changes will be
            reflected here before they take effect.
          </p>
        </Section>

        <Section title="8. Contact us">
          <p>Questions about this policy, or requests about your data, are welcome through either channel below.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
            >
              <Mail size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10"
            >
              <MessageCircle size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
