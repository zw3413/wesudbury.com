import { cache } from 'react'

export const useTranslation = cache(async (lang: string) => {
  const translations = await import(`../public/locales/${lang}/common.json`)

  return {
    t: (key: string) => {
      return key.split('.').reduce((o, i) => (o as any)?.[i], translations) || key
    },
    lang,
  }
})