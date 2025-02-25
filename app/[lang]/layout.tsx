import BottomNavigation from '@/components/BottomNavigation'
import { useTranslation } from '@/lib/i18n'
import ClientExecute from './clientExecute'

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { t } = await useTranslation(lang, 'common')

  const navigationTranslations = {
    home: t('nav.home'),
    lifestyle: t('nav.lifestyle'),
    map: t('nav.map'),
    carpool: t('nav.carpool')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientExecute></ClientExecute>
      {/* <Header lang={lang} translations={navigationTranslations} /> */}
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      <BottomNavigation lang={lang} translations={navigationTranslations} />
      <footer className="bg-gray-100 text-center py-4 mt-8 hidden md:block">
        <p>&copy; 2024 WeSudbury. All rights reserved.</p>
      </footer>
    </div>
  )
}