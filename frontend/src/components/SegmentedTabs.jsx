/**
 * A small pill-shaped segmented control with a sliding active indicator -
 * a lighter-weight, more animated alternative to a native `<select>` for a
 * short list of mutually exclusive options (e.g. This Month / Last Month).
 */
export default function SegmentedTabs({ options, value, onChange, 'aria-label': ariaLabel }) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  )

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium dark:bg-slate-800"
    >
      <div
        className="absolute inset-y-0.5 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out dark:bg-slate-700"
        style={{ width: `${100 / options.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 flex-1 rounded-md px-3 py-1 transition-colors ${
            opt.value === value ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
