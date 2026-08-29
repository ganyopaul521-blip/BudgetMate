export default function Card({ as: Tag = 'div', className = '', padded = true, children, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
