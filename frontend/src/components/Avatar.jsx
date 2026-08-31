function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
}

/** Shows the user's profile picture if set, otherwise falls back to their initials. */
export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizeClasses = SIZES[size] || SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile picture` : 'Profile picture'}
        className={`shrink-0 rounded-full object-cover ${sizeClasses} ${className}`}
      />
    )
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white ${sizeClasses} ${className}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
