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
      <BackButton url={`/${lang}/`}/>
      <h1 className="text-4xl font-bold tracking-tight text-[rgb(40,76,96)] text-center">{t('rideshare.title')}</h1>
  
      <p className="text-base mb-4 text-right tracking-tight">Or 
        
        <a href={`/${lang}/rideshare/offer`} className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-1 px-2 mx-2 rounded-full transition-colors">{t('rideshare.offer')}</a>
     
        </p>
      
      {/* <div className="flex justify-center space-x-4 mb-8">
        <a href={`/${lang}/rideshare/offer`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded">
          {t('rideshare.offer')}
        </a>
        <a href={`/${lang}/rideshare/request`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded">
          {t('rideshare.request')}
        </a>
      </div> */}

      <section className=" inset-0 bg-gradient-to-br from-[rgba(40,76,96,1)] to-[rgba(40,76,96,0.6)] rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">{t('rideshare.availableRides')}</h2>
        <AvailableRides translations={translations} lang={lang} />
      </section>
    </div>
  )
}