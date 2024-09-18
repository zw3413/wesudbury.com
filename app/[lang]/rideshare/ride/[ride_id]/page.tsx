import { useTranslation } from '@/lib/i18n'
import { createClient } from '@supabase/supabase-js'
import BackButton from '@/components/BackButton'
import ShareButton from '@/components/ShareButton'
import BookButton from '@/components/BookButton'
import { FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaSmoking, FaDog, FaVenusMars, FaMapMarkerAlt } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getRideDetails(rideId: string) {
    const decodedKey = decodeURIComponent(rideId);
    const { data, error } = await supabase
        .from('rides')
        .select('key, rideinfo, created_at')
        .eq('key', decodedKey)
        .single()

    if (error) {
        console.error('Error fetching ride details:', error)
        return null
    }

    // Fetch driver's vehicle info
    const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('vehicle_info')
        .eq('email', data.rideinfo.driver_email)
        .single()

    if (driverError) {
        console.error('Error fetching driver details:', driverError)
    }

    return {
        key: data.key,
        created_at: data.created_at,
        ...data.rideinfo,
        vehiclePictureUrl: driverData?.vehicle_info?.pictureUrl
    }
}

export default async function RideDetailsPage({ params: { lang, ride_id } }: { params: { lang: string, ride_id: string } }) {
    const { t } = await useTranslation(lang, 'common')
    const rideDetails = await getRideDetails(ride_id)
    const translations = {
        bookRide: t('rideshare.form.bookRide'),
    }
    if (!rideDetails) {
        return (
            <div className="min-h-screen bg-[rgb(250,252,255)] flex items-center justify-center">
                <div className="text-center text-2xl font-bold text-[rgb(33,41,49)]">
                    {t('rideshare.noRideFound')}
                </div>
            </div>
        )
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/rideshare/ride/${ride_id}`;

    const vehiclePictureUrl = rideDetails.vehiclePictureUrl
        ? `/api/image-proxy?key=${encodeURIComponent(rideDetails.vehiclePictureUrl)}`
        : null;

    return (
        <div className="min-h-screen bg-[rgb(250,252,255)] pt-8">
            <div className="container mx-auto px-4 py-8">
                <BackButton url={`/${lang}/rideshare`} />
                <div id="ride-details-card-large" className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div id="ride-details-card-standard" >

                        <div id="ride-details-card-mini" className="relative overflow-hidden rounded-lg shadow-2xl">
                            {vehiclePictureUrl && (
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={vehiclePictureUrl}
                                        alt="Vehicle"
                                        fill
                                        sizes="100vw"
                                        style={{ objectFit: 'cover' }}
                                        className="opacity-40"
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(54,89,108,0.9)] to-[rgba(54,89,108,0.7)] z-10"></div>
                            <div className="relative z-20 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex-grow mb-4 sm:mb-0">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
                                        {t('rideshare.form.rideDetails')}
                                    </h1>
                                    <p className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-4 drop-shadow-md">
                                        {rideDetails.from_city} 
                                        <span className="mx-1 sm:mx-2 text-yellow-300">→</span> 
                                        {rideDetails.to_city}
                                    </p>
                                    <div className="flex items-center space-x-4 sm:space-x-6 text-base sm:text-lg text-white">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-1 sm:mr-2 text-yellow-300" />
                                            {rideDetails.date}
                                        </div>
                                        <div className="flex items-center">
                                            <FaClock className="mr-1 sm:mr-2 text-yellow-300" />
                                            {rideDetails.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
                                    <div className="bg-white p-2 rounded-lg shadow-lg">
                                        <QRCodeSVG value={shareUrl} size={80} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem icon={<FaMapMarkerAlt />} label={t('rideshare.form.from')} value={`${rideDetails.from_city}, ${rideDetails.from_address ? rideDetails.from_address : ''}`} />
                                <DetailItem icon={<FaMapMarkerAlt />} label={t('rideshare.form.to')} value={`${rideDetails.to_city}, ${rideDetails.to_address ? rideDetails.to_address : ''}`} />
                                <div className="grid grid-cols-2 gap-4">
                                    {rideDetails.seats > 0 && (<DetailItem icon={<FaUsers />} label={t('rideshare.form.seats')} value={rideDetails.seats.toString()} />)}
                                    {rideDetails.price && (<DetailItem icon={<FaDollarSign />} label={t('rideshare.form.price')} value={`$${rideDetails.price}`} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-4 p-6">
                        <h2 className="text-xl font-semibold mb-3 text-[rgb(54,89,108)]">{t('rideshare.form.preferences')}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem icon={<FaSmoking />} label={t('rideshare.form.smokingAllowed')} value={rideDetails.smoking ? t('yes') : t('no')} />
                            <DetailItem icon={<FaDog />} label={t('rideshare.form.petFriendly')} value={rideDetails.pet_friendly ? t('yes') : t('no')} />
                            <DetailItem icon={<FaVenusMars />} label={t('rideshare.form.preferredPassengerGender')} value={t(`rideshare.form.gender.${rideDetails.preferred_passenger_gender}`)} />
                            {/* <DetailItem icon={<FaRulerHorizontal />} label={t('rideshare.form.maxDetourDistance')} value={`${rideDetails.max_detour_distance} km`} /> */}
                        </div>
                    </div>
                    {rideDetails.notes && (
                        <div className="border-t pt-4 p-6">
                            <h2 className="text-xl font-semibold mb-2 text-[rgb(54,89,108)]">{t('rideshare.form.notes')}</h2>
                            <p className="text-[rgb(33,41,49)]">{rideDetails.notes}</p>
                        </div>
                    )}
                </div>
                <div className=" p-6 justify-around space-x-2 flex ">
                    <div className="w-1/2 flex flex-col space-y-2 place-content-around">
                        <BookButton rideId={ride_id} translations={translations} lang={lang} />
                    </div>
                    <div className="w-1/2 flex justify-end">
                        <ShareButton />
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