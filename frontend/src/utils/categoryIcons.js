import {
  Bus,
  Coins,
  GraduationCap,
  Gift,
  HeartPulse,
  Home,
  MoreHorizontal,
  Sparkles,
  Shirt,
  Smartphone,
  Briefcase,
  Utensils,
  Wallet,
  Zap,
  Film,
} from 'lucide-react'

// Maps BudgetMate's real seeded category names (backend/src/constants/categories.js)
// to a representative icon. Unrecognized/custom category names fall back to a
// generic icon rather than guessing.
const ICON_BY_CATEGORY = {
  'Food & Groceries': Utensils,
  Transportation: Bus,
  Accommodation: Home,
  Utilities: Zap,
  'Mobile Money Fees': Smartphone,
  Entertainment: Film,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Clothing: Shirt,
  'Personal Care': Sparkles,
  'Data & Airtime': Smartphone,
  'Salary/Allowance': Wallet,
  'Business Income': Briefcase,
  Gift: Gift,
  'Other Income': Coins,
  Other: MoreHorizontal,
}

export function getCategoryIcon(categoryName) {
  return ICON_BY_CATEGORY[categoryName] || MoreHorizontal
}
