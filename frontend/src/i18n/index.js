import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

const STORAGE_KEY = 'budgetmate_language'

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored
  const browserLang = navigator.language?.slice(0, 2)
  return SUPPORTED_LANGUAGES.some((l) => l.code === browserLang) ? browserLang : 'en'
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.language

export default i18n
