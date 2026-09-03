import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { transactionsApi } from '../api/endpoints'
import { useFormatCurrency } from '../hooks/useFormatCurrency'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryIcon } from '../utils/categoryIcons'
import { formatDate } from '../utils/format'

const PAGES = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Pay', to: '/pay' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
]

/** Real search: debounced query against the actual transactions endpoint (description + category), plus client-side page matching. */
export default function GlobalSearch() {
  const navigate = useNavigate()
  const formatCurrency = useFormatCurrency()
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const trimmed = query.trim()
  const matchedPages = trimmed ? PAGES.filter((p) => p.label.toLowerCase().includes(trimmed.toLowerCase())) : []

  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const timer = setTimeout(() => {
      transactionsApi
        .list({ search: trimmed, pageSize: 5 })
        .then((res) => setResults(res.data.transactions))
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [trimmed])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const goToPage = (to) => {
    navigate(to)
    setOpen(false)
    setQuery('')
  }

  const goToTransactions = () => {
    navigate('/transactions')
    setOpen(false)
    setQuery('')
  }

  const showPanel = open && trimmed.length > 0

  return (
    <div className="relative hidden w-full max-w-md sm:block" ref={containerRef}>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search (e.g. transactions, budgets...)"
          aria-label="Search transactions and pages"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-14 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-900/40"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
          &#8984;K
        </kbd>
      </div>

      {showPanel && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {matchedPages.length > 0 && (
            <div className="px-2 pb-1">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Pages</p>
              {matchedPages.map((p) => (
                <button
                  key={p.to}
                  onClick={() => goToPage(p.to)}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="px-2">
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Transactions</p>
            {searching ? (
              <p className="px-3 py-3 text-sm text-slate-400 dark:text-slate-500">Searching...</p>
            ) : results.length === 0 ? (
              <p className="px-3 py-3 text-sm text-slate-400 dark:text-slate-500">No matching transactions.</p>
            ) : (
              results.map((t) => {
                const Icon = getCategoryIcon(t.category.name)
                const color = getCategoryColor(t.category.name)
                const isIncome = t.type === 'income'
                return (
                  <button
                    key={t.id}
                    onClick={goToTransactions}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`} aria-hidden="true">
                      <Icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {t.description || t.category.name}
                      </span>
                      <span className="block truncate text-xs text-slate-400 dark:text-slate-500">{formatDate(t.transactionDate)}</span>
                    </span>
                    <span
                      className={`shrink-0 text-xs font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
