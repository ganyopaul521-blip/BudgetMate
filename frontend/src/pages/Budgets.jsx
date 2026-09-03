import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { budgetsApi, categoriesApi } from '../api/endpoints'
import BudgetCard from '../components/BudgetCard'
import BudgetOverviewCard from '../components/BudgetOverviewCard'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import Select from '../components/Select'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryIcon } from '../utils/categoryIcons'
import { MONTH_NAMES } from '../utils/format'

const now = new Date()

export default function Budgets() {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [drafts, setDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [catRes, budRes] = await Promise.all([
      categoriesApi.list('expense'),
      budgetsApi.list({ month, year }),
    ])
    setCategories(catRes.data.categories)
    setBudgets(budRes.data.budgets)
    setLoading(false)
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

  const totalBudget = budgets.reduce((sum, b) => sum + b.amountLimit, 0)
  const percentSet = categories.length > 0 ? (budgets.length / categories.length) * 100 : 0

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Set a monthly spending limit for each category and take control of your finances."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <Select aria-label="Select month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </Select>
              <Select aria-label="Select year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
            {!loading && <BudgetOverviewCard totalBudget={totalBudget} percentSet={percentSet} />}
          </div>
        }
      />

      {loading ? (
        <LoadingState variant="cards" cards={6} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const budget = budgetFor(cat.id)
            const Icon = getCategoryIcon(cat.name)
            const color = getCategoryColor(cat.name)
            const saveRow = (
              <div className="mt-3 flex gap-2">
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  aria-label={`Set monthly limit for ${cat.name}`}
                  placeholder={budget ? 'Update limit (GH₵)' : 'Set monthly limit (GH₵)'}
                  value={drafts[cat.id] || ''}
                  onChange={(e) => setDrafts({ ...drafts, [cat.id]: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={() => handleSave(cat.id)}
                  loading={savingId === cat.id}
                  aria-label={`Save budget for ${cat.name}`}
                >
                  <Save size={15} aria-hidden="true" />
                </Button>
              </div>
            )

            if (budget) {
              return (
                <BudgetCard
                  key={cat.id}
                  categoryName={cat.name}
                  spent={budget.spent}
                  amountLimit={budget.amountLimit}
                  percentUsed={budget.percentUsed}
                >
                  {saveRow}
                </BudgetCard>
              )
            }

            return (
              <Card key={cat.id}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`} aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">No budget set yet</p>
                  </div>
                </div>
                {saveRow}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
