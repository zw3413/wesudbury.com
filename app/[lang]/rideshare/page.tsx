import { useTranslation } from '@/lib/i18n'
import AvailableRides from '@/components/AvailableRides'
import { mockRides } from '@/mockData/rides'

export default async function Rideshare({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'common')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{t('rideshare.title')}</h1>
      <p className="text-lg mb-8 text-center">{t('rideshare.description')}</p>
      
      <div className="flex justify-center space-x-4 mb-8">
        <a href={`/${lang}/rideshare/offer`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded">
          {t('rideshare.offer')}
        </a>
        <a href={`/${lang}/rideshare/request`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded">
          {t('rideshare.request')}
        </a>
      </div>

      <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-[rgb(54,89,108)] text-center">{t('rideshare.availableRides')}</h2>
        <AvailableRides rides={mockRides} t={t} lang={lang} />
      </section>
    </div>
  )
}