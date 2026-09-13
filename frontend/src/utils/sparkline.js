// Smooths a small set of points into a wavy path using quadratic curves
// through their midpoints - a standard trick for turning a handful of real
// data points into a gentle curve instead of a jagged polyline.
function buildSmoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    const midY = (p0.y + p1.y) / 2
    d += ` Q ${p0.x} ${p0.y} ${midX} ${midY}`
  }
  const last = points[points.length - 1]
  d += ` T ${last.x} ${last.y}`
  return d
}

/**
 * Builds a smoothed sparkline path (and its filled-area variant) from a real
 * series of numbers, scaled to fill a `width` x `height` viewBox. Flat/equal
 * data legitimately renders as a flat line - never fabricated variation.
 */
export function computeSparkline(values, { width = 100, height = 40, padTop = 4, padBottom = 4 } = {}) {
  if (values.length < 2) return { line: '', area: '' }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - padBottom - ((v - min) / range) * (height - padTop - padBottom),
  }))

  const line = buildSmoothPath(points)
  const area = `${line} L ${width} ${height} L 0 ${height} Z`
  return { line, area }
}
