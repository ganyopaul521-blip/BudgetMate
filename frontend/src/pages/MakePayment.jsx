import { AlertTriangle, CheckCircle2, Clock, CreditCard, ReceiptText, ShieldCheck, Smartphone, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesApi, paymentsApi } from '../api/endpoints'
import AlertBanner from '../components/AlertBanner'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import Select from '../components/Select'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate, PAYMENT_METHOD_LABELS } from '../utils/format'

const STATUS_META = {
  success: { tone: 'success', icon: CheckCircle2, label: 'Success' },
  pending: { tone: 'warning', icon: Clock, label: 'Pending' },
  failed: { tone: 'danger', icon: XCircle, label: 'Failed' },
}

export default function MakePayment() {
  const { user } = useAuth()
  const formatCurrency = useFormatCurrency()
  const { showToast } = useToast()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ categoryId: '', amount: '', description: '', channel: 'mobile_money' })
  const [projection, setProjection] = useState(null)
  const [checking, setChecking] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [successAlert, setSuccessAlert] = useState(null)
  const [payments, setPayments] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(false)
  const [confirmExceeded, setConfirmExceeded] = useState(false)

  const loadPayments = async () => {
    setHistoryLoading(true)
    setHistoryError(false)
    try {
      const res = await paymentsApi.list()
      setPayments(res.data.payments)
    } catch {
      setHistoryError(true)
    } finally {
      setHistoryLoading(false)
    }
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

  const startPayment = async () => {
    setError('')
    if (!window.PaystackPop) {
      setError('Payment widget failed to load. Check your internet connection and try again.')
      return
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
              showToast(`Payment of ${formatCurrency(amount)} was processed successfully.`)
              setForm({ categoryId: '', amount: '', description: '', channel: form.channel })
              setProjection(null)
              loadPayments()
            })
            .catch(() => {
              setError('Payment went through, but we could not confirm it. Check your payment history below.')
              showToast('Unable to confirm your payment. Please check your payment history.', { type: 'error' })
            })
            .finally(() => setPaying(false))
        },
      })
      handler.openIframe()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment')
      showToast('Unable to start payment. Please try again.', { type: 'error' })
      setPaying(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (projection?.level === 'exceeded') {
      setConfirmExceeded(true)
      return
    }
    startPayment()
  }

  const selectedCategory = categories.find((c) => c.id === form.categoryId)

  return (
    <div>
      <PageHeader title="Make a Payment" description="Pay bills and vendors securely through BudgetMate." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <AlertBanner alert={successAlert} onDismiss={() => setSuccessAlert(null)} />

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  {error}
                </p>
              )}

              <Select
                label="Category"
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Amount (GH₵)"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />

              {checking && <p className="text-xs text-slate-400 dark:text-slate-500">Checking your budget...</p>}

              {projection?.hasBudget && projection.level !== 'ok' && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                    projection.level === 'exceeded'
                      ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-400'
                      : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}
                >
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
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
                <p className="text-xs text-slate-400 dark:text-slate-500">No budget set for this category yet — nothing to check against.</p>
              )}

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Payment channel</legend>
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.channel === 'mobile_money'}
                    onClick={() => setForm({ ...form, channel: 'mobile_money' })}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900 ${
                      form.channel === 'mobile_money'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Smartphone size={15} aria-hidden="true" /> Mobile Money
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.channel === 'card'}
                    onClick={() => setForm({ ...form, channel: 'card' })}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900 ${
                      form.channel === 'card'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <CreditCard size={15} aria-hidden="true" /> Card
                  </button>
                </div>
              </fieldset>

              <Input
                label="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. DSTV subscription, hostel fees"
              />

              <Button
                type="submit"
                fullWidth
                loading={paying}
                variant={projection?.level === 'exceeded' ? 'danger' : 'primary'}
              >
                {projection?.level === 'exceeded' ? 'Pay Anyway' : 'Pay Now'}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck size={13} aria-hidden="true" /> Secured by Paystack. Test mode — no real money is charged.
              </p>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          {(form.categoryId || form.amount) && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Payment Summary</h2>
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400 dark:text-slate-500">Category</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">{selectedCategory?.name || '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400 dark:text-slate-500">Amount</dt>
                  <dd className="font-medium tabular-nums text-slate-700 dark:text-slate-200">
                    {form.amount ? formatCurrency(Number(form.amount)) : '—'}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400 dark:text-slate-500">Payment Method</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">{PAYMENT_METHOD_LABELS[form.channel]}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
                  <dt className="font-semibold text-slate-700 dark:text-slate-200">Total</dt>
                  <dd className="text-base font-bold tabular-nums text-slate-900 dark:text-white">
                    {form.amount ? formatCurrency(Number(form.amount)) : formatCurrency(0)}
                  </dd>
                </div>
              </dl>
            </Card>
          )}

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Payment History</h2>
            {historyLoading ? (
              <LoadingState variant="cards" cards={2} />
            ) : historyError ? (
              <Card className="flex flex-col items-center py-8 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Unable to load payment history</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={loadPayments}>
                  Try Again
                </Button>
              </Card>
            ) : (
              <Card padded={false}>
                {payments.length === 0 ? (
                  <EmptyState icon={ReceiptText} title="No payments yet" description="Payments you make will show up here." />
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payments.map((p) => {
                      const status = STATUS_META[p.status] || STATUS_META.pending
                      const StatusIcon = status.icon
                      const CategoryIcon = getCategoryIcon(p.category.name)
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                            aria-hidden="true"
                          >
                            <CategoryIcon size={16} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-700 dark:text-slate-200">{p.category.name}</p>
                            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                              {p.description || 'Payment'} &middot; {formatDate(p.createdAt)}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">{formatCurrency(p.amount)}</p>
                            <Badge tone={status.tone} icon={StatusIcon} className="mt-0.5">
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmExceeded}
        onClose={() => setConfirmExceeded(false)}
        onConfirm={() => {
          setConfirmExceeded(false)
          startPayment()
        }}
        title="This will exceed your budget"
        message={
          projection
            ? `Paying ${formatCurrency(Number(form.amount))} will exceed your ${formatCurrency(projection.amountLimit)} budget for this category by ${formatCurrency(projection.overBy)}. Proceed anyway?`
            : ''
        }
        confirmLabel="Pay Anyway"
      />
    </div>
  )
}
