import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authApi, categoriesApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', currency: user?.currency || 'GHS' })
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' })

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
      setStatus('Profile updated.')
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return
    await categoriesApi.create(newCategory)
    setNewCategory({ name: '', type: 'expense' })
    loadCategories()
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return
    await categoriesApi.remove(id)
    loadCategories()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="GHS">Ghana Cedi (GH₵)</option>
              <option value="USD">US Dollar ($)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">Custom Categories</h2>
        <form onSubmit={handleAddCategory} className="mb-4 flex gap-2">
          <input
            placeholder="e.g. Susu Contribution"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <select
            value={newCategory.type}
            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <Plus size={14} />
          </button>
        </form>

        <div className="divide-y divide-slate-100">
          {categories.length === 0 && <p className="text-sm text-slate-400">No custom categories yet.</p>}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-slate-600">
                {c.name} <span className="text-xs text-slate-400">({c.type})</span>
              </span>
              <button onClick={() => handleDeleteCategory(c.id)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
