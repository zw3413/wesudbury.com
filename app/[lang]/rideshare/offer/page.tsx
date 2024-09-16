import { useTranslation } from '@/lib/i18n'
import RideOfferForm from '@/components/RideOfferForm'
import BackButton from '@/components/BackButton'

export default async function OfferRide({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'common')

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
    'rideDetails': t('rideshare.form.rideDetails'),
    'ridePreferences': t('rideshare.form.ridePreferences'),
    'smoking': t('rideshare.form.smoking'),
    'petFriendly': t('rideshare.form.petFriendly'),
    'preferredPassengerGender': t('rideshare.form.preferredPassengerGender'),
    'maxDetourDistance': t('rideshare.form.maxDetourDistance'),
    'estimatedTravelTime': t('rideshare.form.estimatedTravelTime'),
    'flexibleDeparture': t('rideshare.form.flexibleDeparture'),
    'oneTime': t('rideshare.form.oneTime'),
    'recurring': t('rideshare.form.recurring'),
    'smokingAllowed': t('rideshare.form.smokingAllowed'),
    'any': t('rideshare.form.any'),
    'male': t('rideshare.form.male'),
    'female': t('rideshare.form.female'),
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 relative">
        <BackButton url={`/${lang}/rideshare`} />
        <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{translations['offerRide']}</h1>
        <RideOfferForm translations={translations} isLoggedIn={false} />
      </div>
    </div>
  )
}