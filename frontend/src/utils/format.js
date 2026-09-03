export const CURRENCIES = [
  { code: 'GHS', label: 'Ghana Cedi', symbol: 'GH₵', flag: '🇬🇭' },
  { code: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'XOF', label: 'West African CFA Franc', symbol: 'CFA', flag: '🌍' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: 'CN¥', flag: '🇨🇳' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
]

const CURRENCY_SYMBOLS = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.symbol]))

/**
 * Formats an amount with the given currency's symbol. This does NOT convert
 * values between currencies - the app stores and enters every amount as-is;
 * changing currency only changes which symbol is shown.
 */
export function formatCurrency(amount, currency = 'GHS') {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  const value = Number(amount || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol} ${value}`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
  card: 'Debit/Credit Card',
  other: 'Other',
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
