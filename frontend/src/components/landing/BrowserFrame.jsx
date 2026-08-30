/** Decorative browser-window chrome used to frame the product showcase preview. */
export default function BrowserFrame({ children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="flex-1 rounded-md bg-slate-100 px-3 py-1 text-center text-[11px] text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          app.budgetmate.com/dashboard
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  )
}
