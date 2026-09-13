import { AlertTriangle, CheckCircle2, MoreHorizontal, Pencil, Save, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { budgetsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryIcon } from '../utils/categoryIcons'
import Badge from './Badge'
import Button from './Button'
import Card from './Card'
import ProgressBar from './ProgressBar'

/**
 * A single category's budget for the month. Owns its own edit/delete UI so
 * every card manages its real save/remove call independently - the parent
 * just re-fetches the list once something changes.
 */
export default function BudgetCard({ categoryId, categoryName, budgetId, spent, amountLimit, percentUsed, month, year, onChanged }) {
  const formatCurrency = useFormatCurrency()
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const hasBudget = amountLimit != null
  const level = hasBudget ? (percentUsed >= 100 ? 'danger' : percentUsed >= 80 ? 'warning' : 'success') : null
  const remaining = hasBudget ? amountLimit - spent : 0
  const Icon = getCategoryIcon(categoryName)
  const color = getCategoryColor(categoryName)

  const startEdit = () => {
    setDraft(hasBudget ? String(amountLimit) : '')
    setEditing(true)
    setMenuOpen(false)
  }

  const handleSave = async () => {
    const value = Number(draft)
    if (!draft || value <= 0) return
    setSaving(true)
    try {
      await budgetsApi.upsert({ categoryId, month, year, amountLimit: value })
      showToast(hasBudget ? 'Budget limit updated' : 'Budget created', { type: 'success' })
      setEditing(false)
      onChanged()
    } catch {
      showToast('Could not save this budget. Try again.', { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!budgetId) return
    setDeleting(true)
    try {
      await budgetsApi.remove(budgetId)
      showToast('Budget removed', { type: 'success' })
      onChanged()
    } catch {
      showToast('Could not remove this budget. Try again.', { type: 'error' })
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`} aria-hidden="true">
          <Icon size={18} />
        </span>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">{categoryName}</h3>
          {level === 'danger' && (
            <Badge tone="danger" icon={AlertTriangle}>
              Exceeded
            </Badge>
          )}
          {level === 'warning' && (
            <Badge tone="warning" icon={AlertTriangle}>
              Near limit
            </Badge>
          )}
          {level === 'success' && (
            <Badge tone="success" icon={CheckCircle2}>
              On track
            </Badge>
          )}
        </div>
      </div>

      {hasBudget ? (
        <>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {formatCurrency(spent)} <span className="text-slate-400 dark:text-slate-500">/ {formatCurrency(amountLimit)}</span>
            </span>
            <span className={`font-semibold tabular-nums ${level === 'danger' ? 'text-rose-600 dark:text-rose-400' : level === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {Math.round(percentUsed)}%
            </span>
          </div>
          <ProgressBar percent={percentUsed} tone={level} label={`${categoryName} budget usage`} />
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {remaining < 0
              ? <>You've exceeded your budget by <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(Math.abs(remaining))}</span>.</>
              : <>{formatCurrency(remaining)} left this month.</>}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">No budget set yet</p>
      )}

      <div className="flex-1" aria-hidden="true" />

      {editing ? (
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              step="0.01"
              autoFocus
              aria-label={`${hasBudget ? 'Update' : 'Set'} monthly limit for ${categoryName}`}
              placeholder="Amount (GH₵)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
            />
          </div>
          <Button variant="secondary" onClick={handleSave} loading={saving} aria-label="Save budget limit">
            <Save size={15} aria-hidden="true" />
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)} aria-label="Cancel">
            <X size={15} aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={Pencil} onClick={startEdit} className="flex-1">
            {hasBudget ? 'Update limit' : 'Set limit'}
          </Button>
          {hasBudget && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex h-full items-center justify-center rounded-lg border border-slate-300 px-2.5 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-10 mt-1.5 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <button
                    role="menuitem"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    {deleting ? 'Removing...' : 'Remove budget'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
