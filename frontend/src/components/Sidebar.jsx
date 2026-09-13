import { CreditCard, ListChecks, LayoutDashboard, LogOut, PieChart, PiggyBank, Settings, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { reportsApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { trendFrom } from '../utils/trends'
import Avatar from './Avatar'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: ListChecks },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: PieChart },
  { to: '/pay', label: 'Pay', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
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

/** Real month-over-month spending trend, reused from Dashboard's own comparison data. Renders nothing without enough real data to say something honest. */
function SidebarInsight({ expenseTrend }) {
  if (!expenseTrend) return null
  const better = !expenseTrend.up

  return (
    <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <Sparkles size={13} className="text-indigo-400" aria-hidden="true" />
        Insight
      </div>
      <p className="text-sm text-slate-200">
        You're spending <span className="font-semibold text-white">{expenseTrend.value}% {expenseTrend.up ? 'more' : 'less'}</span> than
        last month. {better ? 'Great job!' : 'Keep an eye on it.'}
      </p>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const [expenseTrend, setExpenseTrend] = useState(null)

  useEffect(() => {
    reportsApi
      .monthlyComparison()
      .then((res) => {
        const months = res.data.data
        if (months?.length >= 2) {
          setExpenseTrend(trendFrom(months[months.length - 1].expense, months[months.length - 2].expense))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 -translate-x-full transform flex-col bg-slate-950 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-extrabold text-white"
              aria-hidden="true"
            >
              B
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-white">BudgetMate</p>
              <p className="text-[11px] leading-tight text-slate-500">Plan Today. Build Tomorrow.</p>
            </div>
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
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>

        <div className="px-3 pb-3">
          <SidebarInsight expenseTrend={expenseTrend} />

          <div className="flex items-center gap-2.5 rounded-xl border-t border-white/10 pt-3">
            <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
