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
        'everyOtherDay': t('rideshare.form.everyOtherDay'),
        'daily': t('rideshare.form.daily'),
        'weekly': t('rideshare.form.weekly'),
        'submit': t('rideshare.form.submit'),
        'every': t('rideshare.form.every'),
        'Sunday': t('rideshare.form.Sunday'),
        'Monday': t('rideshare.form.Monday'),
        'Tuesday': t('rideshare.form.Tuesday'),
        'Wednesday': t('rideshare.form.Wednesday'),
        'Thursday': t('rideshare.form.Thursday'),
        'Friday': t('rideshare.form.Friday'),
        'Saturday': t('rideshare.form.Saturday'),
        'rideDetails': t('rideshare.form.rideDetails'),
        'ridePreferences': t('rideshare.form.ridePreferences'),
        'preferences': t('rideshare.form.preferences'),
        'smoking': t('rideshare.form.smoking'),
        'petFriendly': t('rideshare.form.petFriendly'),
        'preferredPassengerGender': t('rideshare.form.preferredPassengerGender'),
        'maxDetourDistance': t('rideshare.form.maxDetourDistance'),
        'estimatedTravelTime': t('rideshare.form.estimatedTravelTime'),
        'flexibleDeparture': t('rideshare.form.flexibleDeparture'),
        'oneTime': t('rideshare.form.oneTime'),
        'recurring': t('rideshare.form.recurring'),
        'smokingAllowed': t('rideshare.form.smokingAllowed'),
        'genderAny': t('rideshare.form.gender.any'),
        'genderMale': t('rideshare.form.gender.male'),
        'genderFemale': t('rideshare.form.gender.female'),
        'Sudbury': t('rideshare.form.cities.Sudbury'),
        'Toronto': t('rideshare.form.cities.Toronto'),
        'Ottawa': t('rideshare.form.cities.Ottawa'),
        'Montreal': t('rideshare.form.cities.Montreal'),
        'Quebec': t('rideshare.form.cities.Quebec'),
        'Halifax': t('rideshare.form.cities.Halifax'),
        'Calgary': t('rideshare.form.cities.Calgary'),
        'Vancouver': t('rideshare.form.cities.Vancouver'),
        'Winnipeg': t('rideshare.form.cities.Winnipeg'),
        'Thunder Bay': t('rideshare.form.cities.Thunder Bay'),
        'Kingston': t('rideshare.form.cities.Kingston'),
        'London': t('rideshare.form.cities.London'),
        'Windsor': t('rideshare.form.cities.Windsor'),
        'Sault Ste. Marie': t('rideshare.form.cities.Sault Ste_ Marie'),
        'Barrie': t('rideshare.form.cities.Barrie'),
        'Niagara Falls': t('rideshare.form.cities.Niagara Falls'),
        'St. Catharines': t('rideshare.form.cities.St_ Catharines'),
        'Guelph': t('rideshare.form.cities.Guelph'),
        'Waterloo': t('rideshare.form.cities.Waterloo'),
        'Cambridge': t('rideshare.form.cities.Cambridge'),

    }

    return (
        <div className="min-h-screen bg-[rgb(250,252,255)]">
            <div className="container mx-auto p-2">
                <BackButton url={`/${lang}/rideshare`} />
                <div className="max-w-2xl pt-4 mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

                    <h1 className="text-4xl font-bold tracking-tight text-[rgb(40,76,96)] text-center">{translations['offerRide']}</h1>

                    <div className="p-6 space-y-6">
                        <RideOfferForm lang={lang} translations={translations} isLoggedIn={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}