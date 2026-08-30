import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import FormError from '../components/FormError'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const validateEmail = (value) => {
    if (!value) return 'Email is required.'
    if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const emailValidation = validateEmail(form.email)
    setEmailError(emailValidation)
    if (emailValidation) return

    if (!form.password) {
      setFormError({ title: 'Unable to log in', message: 'Please enter your password.' })
      return
    }

    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err.response?.status === 401) {
        setFormError({ title: 'Unable to log in', message: 'Please check your email and password and try again.' })
      } else if (err.response?.data?.message) {
        setFormError({ message: err.response.data.message })
      } else {
        setFormError({ title: 'Unable to log in', message: 'Something went wrong. Please check your connection and try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your BudgetMate account">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError title={formError?.title} message={formError?.message} />

          <Input
            label="Email"
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
            placeholder="you@example.com"
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            {submitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
