import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export default async function Rideshare({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang)

  return (
    <div className="container mx-auto px-4 py-8 bg-[rgb(250,252,255)]">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{t('rideshare.title')}</h1>
      <p className="text-lg sm:text-xl md:text-2xl text-[rgb(33,41,49)] max-w-2xl mx-auto mb-12 text-center">{t('rideshare.description')}</p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('rideshare.offerRide')}</h2>
          <p className="mb-6 text-[rgb(33,41,49)]">{t('rideshare.offerDescription')}</p>
          <Link 
            href={`/${lang}/rideshare/offer`} 
            className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full inline-block transition-colors"
          >
            {t('rideshare.offer')}
          </Link>
        </section>

        <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('rideshare.requestRide')}</h2>
          <p className="mb-6 text-[rgb(33,41,49)]">{t('rideshare.requestDescription')}</p>
          <Link 
            href={`/${lang}/rideshare/request`} 
            className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full inline-block transition-colors"
          >
            {t('rideshare.request')}
          </Link>
        </section>
      </div>

      <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-[rgb(54,89,108)] text-center">{t('rideshare.availableRides')}</h2>
        {/* Here you would typically fetch and display a list of available rides */}
        <p className="text-[rgb(33,41,49)] text-center">{t('rideshare.noRidesAvailable')}</p>
      </section>
    </div>
  )
}