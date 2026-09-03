// Distinct accent color per real seeded category (backend/src/constants/categories.js),
// paired with the icons in categoryIcons.js. Purely presentational - gives each
// category card a consistent, recognizable identity instead of one repeated tint.
const COLOR_BY_CATEGORY = {
  'Food & Groceries': { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400' },
  Transportation: { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  Accommodation: { bg: 'bg-violet-100 dark:bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400' },
  Utilities: { bg: 'bg-lime-100 dark:bg-lime-500/15', text: 'text-lime-600 dark:text-lime-400' },
  'Mobile Money Fees': { bg: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400' },
  Entertainment: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/15', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  Education: { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' },
  Healthcare: { bg: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-600 dark:text-red-400' },
  Clothing: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
  'Personal Care': { bg: 'bg-cyan-100 dark:bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400' },
  'Data & Airtime': { bg: 'bg-sky-100 dark:bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400' },
  'Salary/Allowance': { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
  'Business Income': { bg: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400' },
  Gift: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/15', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  'Other Income': { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' },
  Other: { bg: 'bg-slate-100 dark:bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400' },
}

const FALLBACK = { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' }

export function getCategoryColor(categoryName) {
  return COLOR_BY_CATEGORY[categoryName] || FALLBACK
}
