import { Moon, Plus, Sun, Tag, Trash2, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { authApi, categoriesApi } from '../api/endpoints'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import PageHeader from '../components/PageHeader'
import Select from '../components/Select'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { CURRENCIES } from '../utils/format'

const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const AVATAR_MAX_BYTES = 5 * 1024 * 1024

export default function Settings() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', currency: user?.currency || 'GHS' })
  const [status, setStatus] = useState('')
  const [statusError, setStatusError] = useState(false)
  const [saving, setSaving] = useState(false)

  const avatarInputRef = useRef(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [removingAvatar, setRemovingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setAvatarError('')
    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarError('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError('Image must be smaller than 5MB.')
      return
    }

    setAvatarUploading(true)
    try {
      const res = await authApi.uploadAvatar(file)
      updateUser(res.data.user)
    } catch (err) {
      setAvatarError(err.response?.data?.message || 'Could not upload image. Please try again.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setRemovingAvatar(true)
    setAvatarError('')
    try {
      const res = await authApi.removeAvatar()
      updateUser(res.data.user)
    } catch (err) {
      setAvatarError(err.response?.data?.message || 'Could not remove image. Please try again.')
    } finally {
      setRemovingAvatar(false)
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

          <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <Avatar src={user?.avatarUrl} name={user?.fullName} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={avatarUploading}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Change photo
                </Button>
                {user?.avatarUrl && (
                  <Button type="button" variant="ghost" size="sm" loading={removingAvatar} onClick={handleRemoveAvatar}>
                    Remove
                  </Button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">JPG, PNG, or WebP. Max 5MB.</p>
              {avatarError && <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{avatarError}</p>}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
          </div>

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
              hint="Changes which symbol amounts are shown with — your existing figures are not converted."
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.symbol})
                </option>
              ))}
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
