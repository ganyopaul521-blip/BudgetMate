import { CheckCircle2, Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import FormError from '../components/FormError'
import Input from '../components/Input'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await authApi.forgotPassword(email)
      // Always show the same generic success state - the backend intentionally
      // doesn't reveal whether the email is registered.
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || t('auth.forgotPassword.genericError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.forgotPassword.title')} subtitle={t('auth.forgotPassword.subtitle')}>
      <Card>
        {submitted ? (
          <div role="status" className="flex items-start gap-2.5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{t('auth.forgotPassword.successMessage', { email })}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormError message={error} />

            <Input
              label={t('auth.forgotPassword.email')}
              type="email"
              required
              leftIcon={Mail}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
            />

            <Button type="submit" fullWidth loading={submitting}>
              {t('auth.forgotPassword.submit')}
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.forgotPassword.rememberedPassword')}{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {t('auth.forgotPassword.logIn')}
        </Link>
      </p>
    </AuthLayout>
  )
}
