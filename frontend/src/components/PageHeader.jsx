export default function PageHeader({ title, description, actions }) {
  return (
    <div className="bm-page-header mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="bm-eyebrow">PERSONAL FINANCE</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {actions && <div className="bm-page-actions flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
