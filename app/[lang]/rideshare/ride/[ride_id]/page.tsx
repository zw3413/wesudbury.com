import { useTranslation } from '@/lib/i18n'
import { createClient } from '@supabase/supabase-js'
import BackButton from '@/components/BackButton'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getRideDetails(rideId: string) {
    const decodedKey = decodeURIComponent(rideId);
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('key', decodedKey)
    .single()

  if (error) {
    console.error('Error fetching ride details:', error)
    return null
  }
  return data
}

export default async function RideDetailsPage({ params: { lang, ride_id } }: { params: { lang: string, ride_id: string } }) {
  const { t } = await useTranslation(lang, 'common')
  const rideDetails = await getRideDetails(ride_id)
if(!rideDetails){
    return(
        <div className="min-h-screen bg-gray-100 text-center place-content-center">no ride found</div>
    )
}else{
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <BackButton url={`/${lang}/rideshare`} />
        <h1 className="text-3xl font-bold mb-6 text-center text-[rgb(54,89,108)]">{t('rideshare.rideDetails')}</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-[rgb(54,89,108)]">{t('rideshare.form.rideDetails')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">{t('rideshare.form.from')}:</p>
              <p>{rideDetails.from_location}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.to')}:</p>
              <p>{rideDetails.to_location}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.date')}:</p>
              <p>{rideDetails.date}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.time')}:</p>
              <p>{rideDetails.time}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.seats')}:</p>
              <p>{rideDetails.seats}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.price')}:</p>
              <p>{rideDetails.price}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.estimatedTravelTime')}:</p>
              <p>{rideDetails.estimated_travel_time}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.flexibleDeparture')}:</p>
              <p>{rideDetails.flexible_departure ? t('yes') : t('no')}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.routine')}:</p>
              <p>{rideDetails.routine}</p>
            </div>
            {rideDetails.routine === 'recurring' && (
              <div>
                <p className="font-medium">{t('rideshare.form.frequency')}:</p>
                <p>{rideDetails.frequency}</p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-4 text-[rgb(54,89,108)]">{t('rideshare.form.ridePreferences')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">{t('rideshare.form.smokingAllowed')}:</p>
              <p>{rideDetails.smoking ? t('yes') : t('no')}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.petFriendly')}:</p>
              <p>{rideDetails.pet_friendly ? t('yes') : t('no')}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.preferredPassengerGender')}:</p>
              <p>{rideDetails.preferred_passenger_gender}</p>
            </div>
            <div>
              <p className="font-medium">{t('rideshare.form.maxDetourDistance')}:</p>
              <p>{rideDetails.max_detour_distance} km</p>
            </div>
          </div>

          {rideDetails.notes && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-[rgb(54,89,108)]">{t('rideshare.form.notes')}</h2>
              <p>{rideDetails.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
}