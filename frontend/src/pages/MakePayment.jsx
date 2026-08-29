import { AlertTriangle, CreditCard, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesApi, paymentsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/format'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
}

export default function MakePayment() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ categoryId: '', amount: '', description: '', channel: 'mobile_money' })
  const [projection, setProjection] = useState(null)
  const [checking, setChecking] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [successAlert, setSuccessAlert] = useState(null)
  const [payments, setPayments] = useState([])

  const loadPayments = async () => {
    const res = await paymentsApi.list()
    setPayments(res.data.payments)
  }

  useEffect(() => {
    categoriesApi.list('expense').then((res) => setCategories(res.data.categories))
    loadPayments()
  }, [])

  // Pre-payment budget projection: re-checked whenever category/amount change, debounced.
  useEffect(() => {
    const amount = Number(form.amount)
    if (!form.categoryId || !amount || amount <= 0) {
      setProjection(null)
      return
    }
    setChecking(true)
    const timer = setTimeout(() => {
      paymentsApi
        .budgetCheck({ categoryId: form.categoryId, amount })
        .then((res) => setProjection(res.data))
        .catch(() => setProjection(null))
        .finally(() => setChecking(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [form.categoryId, form.amount])

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')

    if (!window.PaystackPop) {
      setError('Payment widget failed to load. Check your internet connection and try again.')
      return
    }

    if (projection?.level === 'exceeded') {
      const proceed = window.confirm(
        `This payment will exceed your ${projection.amountLimit ? formatCurrency(projection.amountLimit) : ''} budget for this category by ${formatCurrency(projection.overBy)}. Proceed anyway?`
      )
      if (!proceed) return
    }

    setPaying(true)
    try {
      const amount = Number(form.amount)
      const initRes = await paymentsApi.initialize({
        categoryId: form.categoryId,
        amount,
        description: form.description || undefined,
        channel: form.channel,
      })
      const { reference } = initRes.data

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round(amount * 100),
        currency: 'GHS',
        ref: reference,
        channels: [form.channel],
        onClose: () => setPaying(false),
        callback: () => {
          paymentsApi
            .verify(reference)
            .then((res) => {
              if (res.data.alert) setSuccessAlert(res.data.alert)
              setForm({ categoryId: '', amount: '', description: '', channel: form.channel })
              setProjection(null)
              loadPayments()
            })
            .catch(() => setError('Payment went through, but we could not confirm it. Check your payment history below.'))
            .finally(() => setPaying(false))
        },
      })
      handler.openIframe()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment')
      setPaying(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Make a Payment</h1>

        <AlertBanner alert={successAlert} onDismiss={() => setSuccessAlert(null)} />

        <form onSubmit={handlePay} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount (GH₵)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {checking && <p className="text-xs text-slate-400">Checking your budget...</p>}

          {projection?.hasBudget && projection.level !== 'ok' && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                projection.level === 'exceeded'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {projection.level === 'exceeded' ? (
                <p>
                  This payment will <span className="font-semibold">exceed your budget</span> for this category by{' '}
                  {formatCurrency(projection.overBy)} ({projection.percentProjected}% of {formatCurrency(projection.amountLimit)}).
                </p>
              ) : (
                <p>
                  This payment will bring you to <span className="font-semibold">{projection.percentProjected}%</span> of your{' '}
                  {formatCurrency(projection.amountLimit)} budget for this category.
                </p>
              )}
            </div>
          )}

          {projection && !projection.hasBudget && (
            <p className="text-xs text-slate-400">No budget set for this category yet — nothing to check against.</p>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Payment channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, channel: 'mobile_money' })}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  form.channel === 'mobile_money' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Smartphone size={15} /> Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, channel: 'card' })}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  form.channel === 'card' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <CreditCard size={15} /> Card
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description (optional)</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. DSTV subscription, hostel fees"
            />
          </div>

          <button
            type="submit"
            disabled={paying}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              projection?.level === 'exceeded' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {paying ? 'Processing...' : projection?.level === 'exceeded' ? 'Pay Anyway' : 'Pay Now'}
          </button>

          <p className="text-center text-xs text-slate-400">Secured by Paystack. Test mode — no real money is charged.</p>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Payment History</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {payments.length === 0 && <p className="px-4 py-6 text-center text-sm text-slate-400">No payments yet.</p>}
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-700">{p.category.name}</p>
                  <p className="text-xs text-slate-400">
                    {p.description || 'Payment'} · {formatDate(p.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{formatCurrency(p.amount)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
