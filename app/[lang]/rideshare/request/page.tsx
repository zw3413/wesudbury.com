import { useTranslation } from '@/lib/i18n'
import RideRequestForm from '@/components/RideRequestForm'
import BackButton from '@/components/BackButton'

export default async function RequestRide({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'common')

  const translations = {
    'requestRide': t('rideshare.requestRide'),
    'from': t('rideshare.form.from'),
    'to': t('rideshare.form.to'),
    'date': t('rideshare.form.date'),
    'time': t('rideshare.form.time'),
    'seats': t('rideshare.form.seats'),
    'maxPrice': t('rideshare.form.maxPrice'),
    'notes': t('rideshare.form.notes'),
    'submit': t('rideshare.form.submit'),
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[rgb(250,252,255)] relative">
      <BackButton lang={lang} />
      <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{translations['requestRide']}</h1>
      <RideRequestForm translations={translations} />
    </div>
  )
}