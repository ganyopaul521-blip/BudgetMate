import { useReveal } from '../hooks/useReveal'

/**
 * Wraps children in a fade/rise-in effect triggered on scroll into view.
 * The rise (translate) only applies under motion-safe, so a
 * prefers-reduced-motion user still gets the fade, just without movement.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const [ref, visible] = useReveal()
  const translateClass = visible ? 'motion-safe:translate-y-0' : 'motion-safe:translate-y-8'

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'} ${translateClass} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...props}
    >
      {children}
    </Tag>
  )
}
