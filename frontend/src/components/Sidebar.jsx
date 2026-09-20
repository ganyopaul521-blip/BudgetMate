import { ArrowUpRight, CreditCard, Home, LayoutDashboard, ListChecks, LogOut, PieChart, PiggyBank, Settings, Sparkles, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import accraSkyline from '../assets/images/accra-skyline.jpg'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

const NAV_GROUPS = [
  { label: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/', label: 'Home', icon: Home, end: true }] },
  { label: 'Money', items: [{ to: '/transactions', label: 'Transactions', icon: ListChecks }, { to: '/pay', label: 'Pay', icon: CreditCard }, { to: '/budgets', label: 'Budgets', icon: PiggyBank }] },
  { label: 'Insights', items: [{ to: '/reports', label: 'Reports', icon: PieChart }] },
  { label: 'Account', items: [{ to: '/settings', label: 'Settings', icon: Settings }] },
]

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => `bm-nav-item group ${isActive ? 'is-active' : ''}`}>
      <span className="bm-nav-icon"><Icon size={17} aria-hidden="true" /></span>
      <span className="flex-1">{label}</span>
      <ArrowUpRight className="bm-nav-arrow" size={14} aria-hidden="true" />
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside id="app-sidebar" className={`bm-sidebar fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 -translate-x-full transform flex-col overflow-hidden transition-transform duration-200 lg:relative lg:z-auto lg:w-[270px] lg:translate-x-0 ${open ? 'translate-x-0' : ''}`} aria-label="Main navigation">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 overflow-hidden" aria-hidden="true">
          <img src={accraSkyline} alt="" className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#080d18]/60 to-[#080d18]" />
        </div>
        <div className="bm-gh-motif pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
        <div className="bm-gh-edge pointer-events-none absolute inset-y-0 right-0 w-[3px] opacity-80" aria-hidden="true" />
        <div className="bm-brand relative px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="bm-logo">B</div>
            <div><p className="text-[17px] font-bold tracking-tight text-white">BudgetMate</p><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Smart money OS</p></div>
          </div>
          <button onClick={onClose} aria-label="Close navigation menu" className="absolute right-4 top-5 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3" aria-label="Primary">
          {NAV_GROUPS.map((group) => <div key={group.label}><p className="bm-nav-label px-3 pb-2">{group.label}</p><div className="space-y-1">{group.items.map((item) => <NavItem key={item.to} {...item} onClick={onClose} />)}</div></div>)}
        </nav>
        <div className="px-3 pb-4">
          <div className="bm-ai-promo mb-3"><div className="flex items-center gap-2"><Sparkles size={15} /><span>Money insights</span></div><p>Turn your spending data into clearer decisions.</p></div>
          <div className="bm-user-card"><Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{user?.fullName}</p><p className="truncate text-[11px] text-slate-500">{user?.email}</p></div><button onClick={logout} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><LogOut size={16} /></button></div>
        </div>
      </aside>
    </>
  )
}
