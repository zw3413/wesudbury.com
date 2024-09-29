import { cache } from 'react'

type NestedTranslations = {
  [key: string]: string | NestedTranslations
}

const SUPPORTED_LANGUAGES = ['en', 'fr'] // Add all supported languages here
const DEFAULT_LANGUAGE = 'en'

export const useTranslation = cache(async (lang: string, ns: string) => {
  const translations = await import(`../public/locales/${lang}/${ns}.json`) as { default: NestedTranslations }

  const t = (key: string): string => {
    return key.split('.').reduce<string | NestedTranslations>((o, i) => {
      if (typeof o === 'object' && o !== null) {
        return o[i] || key
      }
      return key
    }, translations.default) as string
  }

  return { t, lang }
})

export function getLanguage(): string {
  if (typeof window === 'undefined') {
    // Server-side: return default language
    return DEFAULT_LANGUAGE
  }

  // Client-side: check cookie
  const cookies = document.cookie.split(';')
  const langCookie = cookies.find(cookie => cookie.trim().startsWith('NEXT_LOCALE='))
  if (langCookie) {
    const lang = langCookie.split('=')[1]
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang
    }
  }

  // Check browser settings
  const browserLang = navigator.language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang
  }

  // Fallback to default language
  return DEFAULT_LANGUAGE
}

export function setLanguage(lang: string): void {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000` // Set cookie for 1 year
  }
}