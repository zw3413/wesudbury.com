import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

const initI18next = async (lang: string, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: lang,
      ns,
      fallbackLng: 'en',
      resources: {
        en: {
          common: require('../../public/locales/en/common.json'),
        },
        fr: {
          common: require('../../public/locales/fr/common.json'),
        },
      },
    })
  return i18nInstance
}

export async function useTranslation(lang: string, ns: string, options: { keyPrefix?: string } = {}) {
  const i18nextInstance = await initI18next(lang, ns)
  return {
    t: i18nextInstance.getFixedT(lang, ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}