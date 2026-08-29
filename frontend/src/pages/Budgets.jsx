import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { budgetsApi, categoriesApi } from '../api/endpoints'
import BudgetProgressBar from '../components/BudgetProgressBar'
import { MONTH_NAMES } from '../utils/format'

const now = new Date()

export default function Budgets() {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [drafts, setDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)

  const load = async () => {
    const [catRes, budRes] = await Promise.all([
      categoriesApi.list('expense'),
      budgetsApi.list({ month, year }),
    ])
    setCategories(catRes.data.categories)
    setBudgets(budRes.data.budgets)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year])

  const budgetFor = (categoryId) => budgets.find((b) => b.categoryId === categoryId)

  const handleSave = async (categoryId) => {
    const value = drafts[categoryId]
    if (!value || Number(value) <= 0) return
    setSavingId(categoryId)
    try {
      await budgetsApi.upsert({ categoryId, month, year, amountLimit: Number(value) })
      setDrafts((d) => ({ ...d, [categoryId]: '' }))
      load()
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Budgets</h1>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((cat) => {
          const budget = budgetFor(cat.id)
          return (
            <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 font-semibold text-slate-800">{cat.name}</p>

              {budget ? (
                <BudgetProgressBar
                  categoryName=""
                  spent={budget.spent}
                  amountLimit={budget.amountLimit}
                  percentUsed={budget.percentUsed}
                />
              ) : (
                <p className="mb-3 text-sm text-slate-400">No budget set for this category yet.</p>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder={budget ? `Update limit (GH₵ ${budget.amountLimit})` : 'Set monthly limit (GH₵)'}
                  value={drafts[cat.id] || ''}
                  onChange={(e) => setDrafts({ ...drafts, [cat.id]: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSave(cat.id)}
                  disabled={savingId === cat.id}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
