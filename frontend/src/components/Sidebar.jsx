import {
  CreditCard,
  LayoutDashboard,
  ListChecks,
  PieChart,
  PiggyBank,
  Settings,
  Wallet,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: ListChecks },
  { to: '/pay', label: 'Pay', icon: CreditCard },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: PieChart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 -translate-x-full transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Wallet size={17} />
            </div>
            <span className="text-lg">BudgetMate</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-400">BudgetMate &middot; Ghana Cedi (GH₵)</p>
        </div>
      </aside>
    </>
  )
}
