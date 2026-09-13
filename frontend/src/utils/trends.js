// Real month-over-month % change - returns null (not shown) rather than a
// misleading 0%/Infinity% when there's no prior-month figure to compare against.
export function trendFrom(current, previous) {
  if (!previous) return null
  const change = ((current - previous) / previous) * 100
  return { value: Math.round(Math.abs(change) * 10) / 10, up: change >= 0 }
}
