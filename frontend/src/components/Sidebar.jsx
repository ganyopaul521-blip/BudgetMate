import {
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  ListChecks,
  Moon,
  PieChart,
  PiggyBank,
  Settings,
  Sun,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { CURRENCIES } from '../utils/format'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/', label: 'Home', icon: Home, end: true },
    ],
  },
  {
    label: 'Money',
    items: [
      { to: '/transactions', label: 'Transactions', icon: ListChecks },
      { to: '/pay', label: 'Pay', icon: CreditCard },
      { to: '/budgets', label: 'Budgets', icon: PiggyBank },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/reports', label: 'Reports', icon: PieChart }],
  },
  {
    label: 'Account',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
]

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={18} aria-hidden="true" />
      {label}
    </NavLink>
  )
}

function SidebarThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span className="flex items-center gap-2.5">
        {isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <ChevronDown size={14} className="text-slate-500" aria-hidden="true" />
    </button>
  )
}

function SidebarCurrencySelect() {
  const { user, updateUser } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleChange = async (e) => {
    const currency = e.target.value
    setSaving(true)
    try {
      const res = await authApi.updateProfile({ currency })
      updateUser(res.data.user)
    } catch {
      // Non-critical - the sidebar selector is a shortcut to a setting also
      // editable (with full error feedback) from the Settings page.
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <select
        value={user?.currency || 'GHS'}
        onChange={handleChange}
        disabled={saving}
        aria-label="Change currency"
        className="w-full appearance-none rounded-lg bg-white/5 px-3 py-2.5 pr-8 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="text-slate-900">
            {c.label} ({c.symbol})
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 -translate-x-full transform flex-col bg-slate-950 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Wallet size={17} />
            </div>
            <span className="text-lg">BudgetMate</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Primary">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="pt-3 first:pt-0">
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem key={item.to} {...item} onClick={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-3">
          <SidebarThemeToggle />
          <SidebarCurrencySelect />
        </div>
      </aside>
    </>
  )
}
