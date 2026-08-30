import { Moon, Plus, Sun, Tag, Trash2, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authApi, categoriesApi } from '../api/endpoints'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import Select from '../components/Select'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', currency: user?.currency || 'GHS' })
  const [status, setStatus] = useState('')
  const [statusError, setStatusError] = useState(false)
  const [saving, setSaving] = useState(false)

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' })
  const [adding, setAdding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCategories = async () => {
    const res = await categoriesApi.list()
    setCategories(res.data.categories.filter((c) => !c.isSystem))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const res = await authApi.updateProfile(form)
      updateUser(res.data.user)
      setStatus('Profile updated successfully.')
      setStatusError(false)
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not update profile')
      setStatusError(true)
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return
    setAdding(true)
    try {
      await categoriesApi.create(newCategory)
      setNewCategory({ name: '', type: 'expense' })
      loadCategories()
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteCategory = async () => {
    setDeleting(true)
    try {
      await categoriesApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadCategories()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your profile, appearance, and custom categories." />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <User size={17} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" /> Profile
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {status && (
              <p
                role="status"
                className={`rounded-lg px-3 py-2 text-sm ${
                  statusError
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                }`}
              >
                {status}
              </p>
            )}
            <Input
              label="Full name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Select
              label="Currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option value="GHS">Ghana Cedi (GH₵)</option>
              <option value="USD">US Dollar ($)</option>
            </Select>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Sun size={17} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" /> Appearance
          </h2>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Choose how BudgetMate looks on this device.</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Theme">
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'light'}
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900 ${
                theme === 'light'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Sun size={15} aria-hidden="true" /> Light
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'dark'}
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900 ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Moon size={15} aria-hidden="true" /> Dark
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Tag size={17} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" /> Custom Categories
          </h2>
          <form onSubmit={handleAddCategory} className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="e.g. Susu Contribution"
              aria-label="New category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Select
                aria-label="New category type"
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                className="flex-1 sm:w-36"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
              <Button type="submit" loading={adding} aria-label="Add category">
                <Plus size={16} aria-hidden="true" />
              </Button>
            </div>
          </form>

          {categories.length === 0 ? (
            <EmptyState title="No custom categories yet" description="Add one above to get started." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">
                    {c.name} <span className="text-xs text-slate-400 dark:text-slate-500">({c.type})</span>
                  </span>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    aria-label={`Delete category: ${c.name}`}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCategory}
        loading={deleting}
        title="Delete this category?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed.` : ''}
        confirmLabel="Delete"
      />
    </div>
  )
}
