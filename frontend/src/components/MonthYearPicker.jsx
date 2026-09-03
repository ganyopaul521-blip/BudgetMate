import { Calendar, ChevronDown } from 'lucide-react'
import { MONTH_NAMES } from '../utils/format'

const OPTION_COUNT = 12

/** Builds the last `OPTION_COUNT` months (most recent first) ending at the real current month - no future months, since there's no real data to show for them yet. */
function buildOptions() {
  const now = new Date()
  const options = []
  for (let i = 0; i < OPTION_COUNT; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    options.push({ month: d.getMonth() + 1, year: d.getFullYear() })
  }
  return options
}

/** Single-pill month/year selector, e.g. for scoping a dashboard snapshot to a real historical month. */
export default function MonthYearPicker({ month, year, onChange }) {
  const options = buildOptions()
  const value = `${year}-${month}`

  const handleChange = (e) => {
    const [y, m] = e.target.value.split('-').map(Number)
    onChange({ month: m, year: y })
  }

  return (
    <div className="relative">
      <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      <select
        value={value}
        onChange={handleChange}
        aria-label="Select month to view"
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {options.map((o) => (
          <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
            {MONTH_NAMES[o.month - 1]} {o.year}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
    </div>
  )
}
