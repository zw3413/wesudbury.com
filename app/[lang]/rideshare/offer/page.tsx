import { useTranslation } from '@/lib/i18n'
import RideOfferForm from '@/components/RideOfferForm'

export default async function OfferRide({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang)

  const translations = {
    'offerRide': t('rideshare.offerRide'),
    'from': t('rideshare.form.from'),
    'to': t('rideshare.form.to'),
    'date': t('rideshare.form.date'),
    'time': t('rideshare.form.time'),
    'vehicleType': t('rideshare.form.vehicleType'),
    'seats': t('rideshare.form.seats'),
    'price': t('rideshare.form.price'),
    'routine': t('rideshare.form.routine'),
    'frequency': t('rideshare.form.frequency'),
    'notes': t('rideshare.form.notes'),
    'submit': t('rideshare.form.submit'),
    'selectVehicle': t('rideshare.form.selectVehicle'),
    'car': t('rideshare.form.car'),
    'suv': t('rideshare.form.suv'),
    'van': t('rideshare.form.van'),
    'oneTime': t('rideshare.form.oneTime'),
    'recurring': t('rideshare.form.recurring'),
    'selectFrequency': t('rideshare.form.selectFrequency'),
    'daily': t('rideshare.form.daily'),
    'weekly': t('rideshare.form.weekly'),
    'weekdays': t('rideshare.form.weekdays'),
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[rgb(250,252,255)]">
      <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{translations['offerRide']}</h1>
      <RideOfferForm translations={translations} />
    </div>
  )
}