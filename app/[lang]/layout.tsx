import Header from './Header'
import BottomNavigation from '@/components/BottomNavigation'
import { useTranslation } from '@/lib/i18n'

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
    rideshare: t('nav.rideshare')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header lang={lang} translations={navigationTranslations} /> */}
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      <BottomNavigation lang={lang} translations={navigationTranslations} />
      <footer className="bg-gray-100 text-center py-4 mt-8 hidden md:block">
        <p>&copy; 2023 WeSudbury. All rights reserved.</p>
      </footer>
    </div>
  )
}