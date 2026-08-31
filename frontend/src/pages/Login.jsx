import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import FormError from '../components/FormError'
import GoogleSignInButton from '../components/GoogleSignInButton'
import Input from '../components/Input'
import OrDivider from '../components/OrDivider'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { GOOGLE_CLIENT_ID } from '../utils/googleIdentity'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { t } = useTranslation()
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  const [form, setForm] = useState({ email: '', password: '' })
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const validateEmail = (value) => {
    if (!value) return t('auth.login.emailRequired')
    if (!EMAIL_PATTERN.test(value)) return t('auth.login.emailInvalid')
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const emailValidation = validateEmail(form.email)
    setEmailError(emailValidation)
    if (emailValidation) return

    if (!form.password) {
      setFormError({ title: t('auth.login.unableTitle'), message: t('auth.login.passwordRequired') })
      return
    }

    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err.response?.status === 401) {
        setFormError({ title: t('auth.login.unableTitle'), message: t('auth.login.unableMessage') })
      } else if (err.response?.data?.message) {
        setFormError({ message: err.response.data.message })
      } else {
        setFormError({ title: t('auth.login.unableTitle'), message: t('auth.login.genericError') })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleCredential = async (credential) => {
    setFormError(null)
    setGoogleSubmitting(true)
    try {
      await loginWithGoogle(credential)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError({
        title: t('auth.login.googleUnableTitle'),
        message: err.response?.data?.message || t('auth.login.genericError'),
      })
    } finally {
      setGoogleSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError title={formError?.title} message={formError?.message} />

          <Input
            label={t('auth.login.email')}
            type="email"
            required
            leftIcon={Mail}
            autoComplete="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              if (emailError) setEmailError('')
            }}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            error={emailError}
            placeholder={t('auth.login.emailPlaceholder')}
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('auth.login.password')}
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t('auth.login.passwordPlaceholder')}
            />
          </div>

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>

        {GOOGLE_CLIENT_ID && (
          <div className="mt-5 space-y-4">
            <OrDivider />
            {googleSubmitting ? (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">{t('auth.signingIn')}</p>
            ) : (
              <GoogleSignInButton onCredential={handleGoogleCredential} />
            )}
          </div>
        )}
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {t('auth.login.createOne')}
        </Link>
      </p>
    </AuthLayout>
  )
}
