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
    <>
      <header className="bg-blue-500 text-white p-4">
        <nav>
          <ul className="flex space-x-4">
            <li><a href={`/${lang}`} className="hover:underline">{t('nav.home')}</a></li>
            <li><a href={`/${lang}/lifestyle`} className="hover:underline">{t('nav.lifestyle')}</a></li>
            <li><a href={`/${lang}/map`} className="hover:underline">{t('nav.map')}</a></li>
            <li><a href={`/${lang}/rideshare`} className="hover:underline">{t('nav.rideshare')}</a></li>
          </ul>
        </nav>
      </header>
      {children}
    </>
  )
}