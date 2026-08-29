import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { alertsApi } from '../api/endpoints'
import { formatDate } from '../utils/format'

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
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    await alertsApi.markAllRead()
    load()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="font-semibold text-slate-800">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-emerald-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">No alerts yet</p>
            )}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-b border-slate-50 px-4 py-3 text-sm ${alert.isRead ? 'bg-white' : 'bg-amber-50'}`}
              >
                <p className={`font-medium ${alert.alertType === 'exceeded' ? 'text-red-600' : 'text-amber-600'}`}>
                  {alert.alertType === 'exceeded' ? 'Budget exceeded' : 'Approaching budget limit'}: {alert.categoryName}
                </p>
                <p className="text-slate-500">{alert.percentUsed}% of budget used</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(alert.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
