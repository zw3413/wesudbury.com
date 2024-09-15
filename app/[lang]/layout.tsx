import Header from './Header'
import { useTranslation } from '@/lib/i18n'

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { t } = await useTranslation(lang, 'common')

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} translations={{
        home: t('nav.home'),
        lifestyle: t('nav.lifestyle'),
        map: t('nav.map'),
        rideshare: t('nav.rideshare')
      }} />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p>&copy; 2023 WeSudbury. All rights reserved.</p>
      </footer>
    </div>
  )
}