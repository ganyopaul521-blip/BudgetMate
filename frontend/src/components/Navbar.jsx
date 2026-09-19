import { ChevronDown, LogOut, Menu, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import GlobalSearch from './GlobalSearch'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

function UserMenu() {
  const { user, logout } = useAuth(); const [open, setOpen] = useState(false); const ref = useRef(null)
  useEffect(() => { const click=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)}; const key=(e)=>{if(e.key==='Escape')setOpen(false)}; document.addEventListener('mousedown',click); document.addEventListener('keydown',key); return()=>{document.removeEventListener('mousedown',click);document.removeEventListener('keydown',key)} },[])
  return <div className="relative" ref={ref}>
    <button onClick={()=>setOpen(v=>!v)} aria-haspopup="menu" aria-expanded={open} className="bm-user-menu"><Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" /><span className="hidden max-w-[10rem] truncate font-semibold sm:inline">{user?.fullName}</span><ChevronDown size={14} className="text-slate-400" /></button>
    {open && <div role="menu" className="bm-dropdown absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border bg-white py-1 shadow-xl dark:bg-slate-900"><div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800"><p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user?.fullName}</p><p className="truncate text-xs text-slate-400">{user?.email}</p></div><Link to="/settings" role="menuitem" onClick={()=>setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><User size={15}/>Profile settings</Link><button role="menuitem" onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"><LogOut size={15}/>Log out</button></div>}
  </div>
}

export default function Navbar({ onMenuClick }) {
  return <header className="bm-navbar sticky top-0 z-20"><div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"><button onClick={onMenuClick} aria-label="Open navigation menu" aria-controls="app-sidebar" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"><Menu size={20}/></button><div className="hidden text-sm font-semibold text-slate-400 md:block">Overview</div><div className="mx-auto flex w-full max-w-xl justify-center md:mx-6 md:justify-start"><div className="bm-search-shell w-full"><GlobalSearch/></div></div><div className="ml-auto flex items-center gap-2 sm:gap-3"><ThemeToggle/><NotificationBell/><div className="hidden h-7 w-px bg-slate-200 dark:bg-slate-800 sm:block"/><UserMenu/></div></div></header>
}
