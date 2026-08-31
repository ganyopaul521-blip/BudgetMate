import { Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
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

export default function Register() {
  const { t } = useTranslation()
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  const validateEmail = (value) => {
    if (!value) return t('auth.register.emailRequired')
    if (!EMAIL_PATTERN.test(value)) return t('auth.register.emailInvalid')
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const emailValidation = validateEmail(form.email)
    setEmailError(emailValidation)
    if (emailValidation) return

    if (!form.fullName.trim()) {
      setFormError({ title: t('auth.register.unableTitle'), message: t('auth.register.fullNameRequired') })
      return
    }
    if (!form.password) {
      setFormError({ title: t('auth.register.unableTitle'), message: t('auth.register.passwordRequired') })
      return
    }

    setSubmitting(true)
    try {
      await register(form.fullName, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const details = err.response?.data?.details
      const detailMsg = details ? Object.values(details).flat().join(' ') : ''
      const message = detailMsg || err.response?.data?.message
      setFormError(message ? { message } : { title: t('auth.register.unableTitle'), message: t('auth.register.genericError') })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleCredential = async (credential) => {
    setFormError(null)
    setGoogleSubmitting(true)
    try {
      await loginWithGoogle(credential)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setFormError({
        title: t('auth.register.googleUnableTitle'),
        message: err.response?.data?.message || t('auth.register.genericError'),
      })
    } finally {
      setGoogleSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <Card className="shadow-xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError title={formError?.title} message={formError?.message} />

          <Input
            label={t('auth.register.fullName')}
            required
            leftIcon={User}
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder={t('auth.register.fullNamePlaceholder')}
          />

          <Input
            label={t('auth.register.email')}
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
            placeholder={t('auth.register.emailPlaceholder')}
          />

          <PasswordInput
            label={t('auth.register.password')}
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={t('auth.register.passwordPlaceholder')}
            hint={t('auth.register.passwordHint')}
          />

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            {submitting ? t('auth.register.submitting') : t('auth.register.submit')}
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
        {t('auth.register.haveAccount')}{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {t('auth.register.logIn')}
        </Link>
      </p>
    </AuthLayout>
  )
}
