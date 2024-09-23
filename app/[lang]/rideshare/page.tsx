import { useTranslation } from '@/lib/i18n'
import BackButton from '@/components/BackButton'
import dynamic from 'next/dynamic'

const AvailableRides = dynamic(() => import('@/components/AvailableRides'), { ssr: false })

export default async function Rideshare({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'common')

  // Create an array of translations that the client component might need
  const translations = [
    'date',
    'time',
    'price',
    'availableSeats',
    'viewDetails',
    // Add any other translation keys used in AvailableRides
  ].reduce((acc, key) => {
    acc[key] = t(key)
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="container mx-auto px-4 py-8 max-w-[800px]">
      <BackButton url={`/${lang}/`} />
      <h1 className="text-4xl font-bold text-[rgb(40,76,96)] text-center mb-6 py-2 px-4 shadow-lg bg-white rounded-lg ">{t('rideshare.title')}</h1>
      {/* <h1 className="text-4xl font-bold text-[rgb(40,76,96)] text-center mb-4">{t('rideshare.title')}</h1> */}
      <div className="text-base mb-4 mt-1 text-center">
        <span className='text-sm ms-4'>or</span>
        <a href={`/${lang}/rideshare/offer`} className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-1 px-2 mx-2 rounded-full transition-colors">{t('rideshare.offer')}</a>
      </div>

      <section className="inset-0 rounded-lg shadow-md  p-6">
        <AvailableRides translations={translations} lang={lang} />
      </section>
    </div>
  )
}