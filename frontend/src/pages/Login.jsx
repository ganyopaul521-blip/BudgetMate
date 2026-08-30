import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your BudgetMate account">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

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

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              leftIcon={Lock}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting} className="mt-1">
            Log In
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
