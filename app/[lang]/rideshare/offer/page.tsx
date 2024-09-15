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
    'driverInfo': t('rideshare.form.driverInfo'),
    'driverName': t('rideshare.form.driverName'),
    'driverPhoneNumber': t('rideshare.form.driverPhoneNumber'),
    'driverEmail': t('rideshare.form.driverEmail'),
    'driverPassword': t('rideshare.form.driverPassword'),
    'confirmPassword': t('rideshare.form.confirmPassword'),
    'licenseVerified': t('rideshare.form.licenseVerified'),
    'languages': t('rideshare.form.languages'),
    'languagesPlaceholder': t('rideshare.form.languagesPlaceholder'),
    'profilePicture': t('rideshare.form.profilePicture'),
    'vehicleInfo': t('rideshare.form.vehicleInfo'),
    'vehicleMake': t('rideshare.form.vehicleMake'),
    'vehicleModel': t('rideshare.form.vehicleModel'),
    'selectMake': t('rideshare.form.selectMake'),
    'selectModel': t('rideshare.form.selectModel'),
    'vehiclePicture': t('rideshare.form.vehiclePicture'),
    'vehicleYearMakeModel': t('rideshare.form.vehicleYearMakeModel'),
    'vehicleColor': t('rideshare.form.vehicleColor'),
    'vehicleLicensePlate': t('rideshare.form.vehicleLicensePlate'),
    'vehicleInsurance': t('rideshare.form.vehicleInsurance'),
    'vehicleInspection': t('rideshare.form.vehicleInspection'),
    'vehicleRegistration': t('rideshare.form.vehicleRegistration'),
    'vehicleDocuments': t('rideshare.form.vehicleDocuments'),
    'vehicleDocumentsPlaceholder': t('rideshare.form.vehicleDocumentsPlaceholder'),
    'vehicleDocumentsUpload': t('rideshare.form.vehicleDocumentsUpload'),
    'vehicleDocumentsUploadPlaceholder': t('rideshare.form.vehicleDocumentsUploadPlaceholder'),
    'vehicleDocumentsUploadButton': t('rideshare.form.vehicleDocumentsUploadButton'),
    'vehicleDocumentsUploadSuccess': t('rideshare.form.vehicleDocumentsUploadSuccess'),
    'vehicleDocumentsUploadError': t('rideshare.form.vehicleDocumentsUploadError'),
    'vehicleDocumentsUploadCancel': t('rideshare.form.vehicleDocumentsUploadCancel'),
    'vehicleDocumentsUploadRemove': t('rideshare.form.vehicleDocumentsUploadRemove'),
    'vehicleDocumentsUploadRemoveConfirm': t('rideshare.form.vehicleDocumentsUploadRemoveConfirm'),
    'vehicleDocumentsUploadRemoveCancel': t('rideshare.form.vehicleDocumentsUploadRemoveCancel'),
    'vehicleDocumentsUploadRemoveSuccess': t('rideshare.form.vehicleDocumentsUploadRemoveSuccess'),
    'vehicleDocumentsUploadRemoveError': t('rideshare.form.vehicleDocumentsUploadRemoveError'),
    'passwordMismatch': t('rideshare.form.passwordMismatch'),
    'rideDetails': t('rideshare.form.rideDetails'),
    'ridePreferences': t('rideshare.form.ridePreferences'),
    'smoking': t('rideshare.form.smoking'),
    'petFriendly': t('rideshare.form.petFriendly'),
    'preferredPassengerGender': t('rideshare.form.preferredPassengerGender'),
    'maxDetourDistance': t('rideshare.form.maxDetourDistance'),
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[rgb(250,252,255)] relative">
      <BackButton lang={lang} />
      <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{translations['offerRide']}</h1>
      <RideOfferForm translations={translations} isLoggedIn={false} />
    </div>
  )
}