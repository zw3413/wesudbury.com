import { useTranslation } from '@/lib/i18n'
import { createClient } from '@supabase/supabase-js'
import BackButton from '@/components/BackButton'
import ShareButton from '@/components/ShareButton'
import { FaCar, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaRoute, FaSmoking, FaDog, FaVenusMars, FaRulerHorizontal } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react';
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

    if (!rideDetails) {
        return (
            <div className="min-h-screen bg-[rgb(250,252,255)] flex items-center justify-center">
                <div className="text-center text-2xl font-bold text-[rgb(33,41,49)]">
                    {t('rideshare.noRideFound')}
                </div>
            </div>
        )
    }

    const shareTitle = `${t('rideshare.shareTitle')} - ${rideDetails.from_location} to ${rideDetails.to_location}`;
    const shareText = `${t('rideshare.shareText')} ${rideDetails.from_location} to ${rideDetails.to_location} on ${rideDetails.date} at ${rideDetails.time}`;
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/rideshare/ride/${ride_id}`;

    return (
        <div className="min-h-screen bg-[rgb(250,252,255)] pt-8">
            <div className="container mx-auto px-4 py-8">
                <BackButton url={`/${lang}/rideshare`} />
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-[rgb(54,89,108)] text-white p-6">
                        <h1 className="text-3xl font-bold mb-2">{t('rideshare.form.rideDetails')}</h1>
                        <p className="text-xl">{rideDetails.from_location} → {rideDetails.to_location}</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem icon={<FaCalendarAlt />} label={t('rideshare.form.date')} value={rideDetails.date} />
                            <DetailItem icon={<FaClock />} label={t('rideshare.form.time')} value={rideDetails.time} />
                            <DetailItem icon={<FaUsers />} label={t('rideshare.form.seats')} value={rideDetails.seats.toString()} />
                            <DetailItem icon={<FaDollarSign />} label={t('rideshare.form.price')} value={`$${rideDetails.price}`} />
                            <DetailItem icon={<FaRoute />} label={t('rideshare.form.estimatedTravelTime')} value={rideDetails.estimated_travel_time} />
                            <DetailItem icon={<FaCar />} label={t('rideshare.form.flexibleDeparture')} value={rideDetails.flexible_departure ? t('yes') : t('no')} />
                        </div>
                        <div className="border-t pt-4">
                            <h2 className="text-xl font-semibold mb-3 text-[rgb(54,89,108)]">{t('rideshare.form.preferences')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem icon={<FaSmoking />} label={t('rideshare.form.smokingAllowed')} value={rideDetails.smoking ? t('yes') : t('no')} />
                                <DetailItem icon={<FaDog />} label={t('rideshare.form.petFriendly')} value={rideDetails.pet_friendly ? t('yes') : t('no')} />
                                <DetailItem icon={<FaVenusMars />} label={t('rideshare.form.preferredPassengerGender')} value={t(`rideshare.form.gender.${rideDetails.preferred_passenger_gender}`)} />
                                <DetailItem icon={<FaRulerHorizontal />} label={t('rideshare.form.maxDetourDistance')} value={`${rideDetails.max_detour_distance} km`} />
                            </div>
                        </div>
                        {rideDetails.notes && (
                            <div className="border-t pt-4">
                                <h2 className="text-xl font-semibold mb-2 text-[rgb(54,89,108)]">{t('rideshare.form.notes')}</h2>
                                <p className="text-[rgb(33,41,49)]">{rideDetails.notes}</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-[rgb(245,247,250)] p-6 justify-around space-x-2 flex ">
                        <div className="w-1/2 flex flex-col space-y-2 place-content-around">
                            <a href={`/${lang}/rideshare/book/${ride_id}`} className="block w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] text-center py-3 rounded-lg font-semibold transition duration-300">
                                {t('rideshare.form.bookRide')}
                            </a>
                            <ShareButton  title={shareTitle} text={shareText} url={shareUrl} />
                        </div>
                        <div className="w-1/2 flex justify-end">

                            <QRCodeSVG value={shareUrl} size={128} />

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center space-x-2">
            <div className="text-[rgb(255,183,77)]">{icon}</div>
            <div>
                <p className="text-sm text-[rgb(33,41,49)]">{label}</p>
                <p className="font-semibold text-[rgb(54,89,108)]">{value}</p>
            </div>
        </div>
    )
}