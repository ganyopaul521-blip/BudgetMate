import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/format'

/** Returns a formatter bound to the logged-in user's chosen display currency. */
export function useFormatCurrency() {
  const { user } = useAuth()
  return (amount) => formatCurrency(amount, user?.currency)
}
