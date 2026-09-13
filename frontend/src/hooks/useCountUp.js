import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number counting from its previous value up (or down) to
 * `target` over `duration` ms - starts from 0 on first mount, then eases
 * between real values whenever `target` changes (new data loads, month
 * switches). Respects prefers-reduced-motion by jumping straight to the
 * target. The number itself is always the real fetched value - this only
 * animates how it's presented.
 */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)
  const frame = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = prevTarget.current
    const to = target
    prevTarget.current = target

    if (prefersReducedMotion || from === to) {
      setValue(to)
      return
    }

    const start = performance.now()
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (to - from) * eased)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}
