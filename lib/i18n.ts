import { cache } from 'react'

type NestedTranslations = {
  [key: string]: string | NestedTranslations
}

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