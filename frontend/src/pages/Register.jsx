import { Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import FormError from '../components/FormError'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
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

    if (!form.fullName.trim()) {
      setFormError({ title: 'Unable to create account', message: 'Please enter your full name.' })
      return
    }
    if (!form.password) {
      setFormError({ title: 'Unable to create account', message: 'Please choose a password.' })
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
      setFormError(
        message
          ? { message }
          : { title: 'Unable to create account', message: 'Something went wrong. Please check your connection and try again.' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Free, and built for Ghana">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError title={formError?.title} message={formError?.message} />

          <Input
            label="Full name"
            required
            leftIcon={User}
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Ama Mensah"
          />

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

          <PasswordInput
            label="Password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
            hint="Must include at least one number and one special character."
          />

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            {submitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
