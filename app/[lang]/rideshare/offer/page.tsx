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
/*
    'Sudbury': {
        center: { lat: 46.4917, lng: -80.9930 },
    },
    'Toronto': {
        center: { lat: 43.65107, lng: -79.347015 },
    },
    'Ottawa': {
        center: { lat: 45.4215, lng: -75.6979 },
    },
    "Thunder Bay": {
        center: { lat: 48.3799, lng: -89.2444 },
    },
    "Kingston": {
        center: { lat: 44.2324, lng: -76.4879 },
    },
    "London": {
        center: { lat: 42.9834, lng: -81.233 },
    },
    "Windsor": {
        center: { lat: 42.3001, lng: -83.018 },
    },
    "Sault Ste. Marie": {
        center: { lat: 46.519, lng: -84.348 },
    },
    "Barrie": {
        center: { lat: 44.3891, lng: -79.6917 },
    },
    "Niagara Falls": {
        center: { lat: 43.0963, lng: -79.0378 },
    },
    "St. Catharines": {
        center: { lat: 43.2203, lng: -79.1863 },
    },
    "Guelph": {
        center: { lat: 43.5448, lng: -80.2486 },
    },
    "Waterloo": {
        center: { lat: 43.4643, lng: -80.5204 },
    },
    "Cambridge": {
        center: { lat: 43.3601, lng: -80.3165 },
    },

*/ 
    return (
        <div className="min-h-screen bg-[rgb(250,252,255)] pt-8">
            <div className="container mx-auto px-4 py-8">
                <BackButton url={`/${lang}/rideshare`} />
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-[rgb(54,89,108)] text-white p-6 justify-around space-x-2 flex">
                        <h1 className="text-3xl font-bold mb-2">{translations['offerRide']}</h1>
                    </div>
                    <div className="p-6 space-y-6">
                        <RideOfferForm lang={lang} translations={translations} isLoggedIn={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}