import { useEffect, useRef, useState } from 'react'

/**
 * Reports whether an element has scrolled into view yet, so callers can fade
 * it in. Always runs the fade (an opacity-only transition doesn't trigger
 * vestibular issues) - it's the caller's job to gate any *movement* (slide,
 * parallax) behind a `motion-safe:` class, since that's the part
 * prefers-reduced-motion actually cares about.
 */
export function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}
