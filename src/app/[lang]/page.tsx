import { useTranslation } from '@/lib/i18n'

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'common')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold mb-6 text-blue-600">{t('welcome')}</h1>
      <p className="text-2xl text-gray-600 max-w-2xl text-center">{t('description')}</p>
    </main>
  )
}