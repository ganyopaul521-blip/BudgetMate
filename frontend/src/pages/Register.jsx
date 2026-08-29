import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form.fullName, form.email, form.password)
      navigate('/')
    } catch (err) {
      const details = err.response?.data?.details
      const detailMsg = details ? Object.values(details).flat().join(' ') : ''
      setError(detailMsg || err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Free, and built for Ghana">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

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
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            leftIcon={Lock}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
            hint="Must include at least one number and one special character."
          />

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            Create Account
          </Button>
        </form>
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
