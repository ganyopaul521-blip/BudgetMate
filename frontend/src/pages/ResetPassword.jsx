import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import FormError from '../components/FormError'
import PasswordInput from '../components/PasswordInput'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword !== form.confirmPassword) {
      setError(t('auth.resetPassword.passwordsDontMatch'))
      return
    }

    setSubmitting(true)
    try {
      await authApi.resetPassword(token, form.newPassword)
      setDone(true)
    } catch (err) {
      const details = err.response?.data?.details
      const detailMsg = details ? Object.values(details).flat().join(' ') : ''
      setError(detailMsg || err.response?.data?.message || t('auth.resetPassword.genericError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.resetPassword.title')}>
      <Card className="shadow-xl">
        {!token && <FormError message={t('auth.resetPassword.missingToken')} />}

        {token && done && (
          <div role="status" className="flex items-start gap-2.5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{t('auth.resetPassword.successMessage')}</p>
          </div>
        )}

        {token && !done && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormError message={error} />

            <PasswordInput
              label={t('auth.resetPassword.newPassword')}
              required
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder={t('auth.resetPassword.passwordPlaceholder')}
              hint={t('auth.resetPassword.passwordHint')}
            />

            <PasswordInput
              label={t('auth.resetPassword.confirmPassword')}
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
            />

            <Button type="submit" fullWidth loading={submitting}>
              {t('auth.resetPassword.submit')}
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {t('auth.resetPassword.backToLogin')}
        </Link>
      </p>
    </AuthLayout>
  )
}
