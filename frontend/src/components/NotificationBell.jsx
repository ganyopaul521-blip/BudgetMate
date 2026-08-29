import { Bell, BellOff, CheckCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { alertsApi } from '../api/endpoints'
import NotificationItem from './NotificationItem'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef(null)

  const load = async () => {
    try {
      const res = await alertsApi.list()
      setAlerts(res.data.alerts)
      setUnreadCount(res.data.unreadCount)
    } catch {
      // silently ignore - notification centre is non-critical
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const handleMarkAllRead = async () => {
    await alertsApi.markAllRead()
    load()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span
            className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white"
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="font-semibold text-slate-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 divide-y divide-slate-50 overflow-y-auto">
            {alerts.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <BellOff size={20} className="text-slate-300" aria-hidden="true" />
                <p className="text-sm text-slate-400">No alerts yet</p>
              </div>
            )}
            {alerts.map((alert) => (
              <NotificationItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
