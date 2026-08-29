import { Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/endpoints'

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Choose a new password</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!token && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              This link is missing its reset token. Please use the link from your email, or request a new one.
            </p>
          )}

          {token && done && (
            <p className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              Your password has been updated. You can now log in with your new password.
            </p>
          )}

          {token && !done && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
                <input
                  type="password"
                  required
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="At least 8 characters"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Must include at least one number and one special character.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Repeat your new password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-emerald-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
