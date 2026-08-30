import { CheckCircle2, Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

export default function ResetPassword() {
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
      setError("Passwords don't match.")
      return
    }

    setSubmitting(true)
    try {
      await authApi.resetPassword(token, form.newPassword)
      setDone(true)
    } catch (err) {
      const details = err.response?.data?.details
      const detailMsg = details ? Object.values(details).flat().join(' ') : ''
      setError(detailMsg || err.response?.data?.message || 'Could not reset password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Choose a new password">
      <Card>
        {!token && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            This link is missing its reset token. Please use the link from your email, or request a new one.
          </p>
        )}

        {token && done && (
          <div role="status" className="flex items-start gap-2.5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>Your password has been updated. You can now log in with your new password.</p>
          </div>
        )}

        {token && !done && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </p>
            )}

            <Input
              label="New password"
              type="password"
              required
              leftIcon={Lock}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="At least 8 characters"
              hint="Must include at least one number and one special character."
            />

            <Input
              label="Confirm new password"
              type="password"
              required
              leftIcon={Lock}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat your new password"
            />

            <Button type="submit" fullWidth loading={submitting}>
              Update Password
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  )
}
