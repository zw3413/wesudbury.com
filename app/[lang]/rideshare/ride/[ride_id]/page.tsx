import { useTranslation } from '@/lib/i18n'
import { createClient } from '@supabase/supabase-js'
import BackButton from '@/components/BackButton'
import ShareButton from '@/components/ShareButton'
import BookButton from '@/components/BookButton'
import DeleteRideButton from '@/components/DeleteRideButton'
import { FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaSmoking, FaDog, FaVenusMars, FaMapMarkerAlt } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image';
import { DriverExtendInfo } from '@/types';

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

    const { data: driverExtendData, error: driverExtenderError } = await supabase
        .from('drivers')
        .select('driver_extend_info')
        .eq('email', data.rideinfo.driver_email)
        .single()

    if (driverExtenderError) {
        console.error('Error fetching driver extend details:', driverExtenderError)
    }
    const driverExtendInfo: DriverExtendInfo = driverExtendData?.driver_extend_info as DriverExtendInfo ?? {};
    return {
        key: data.key,
        created_at: data.created_at,
        ...data.rideinfo,
        ...driverExtendInfo,
        vehiclePictureUrl: driverData?.vehicle_info?.pictureUrl
    }
}

export default async function RideDetailsPage({ params: { lang, ride_id } }: { params: { lang: string, ride_id: string } }) {
    const { t } = await useTranslation(lang, 'common')
    const rideDetails = await getRideDetails(ride_id)
    const translations = {
        bookRide: t('rideshare.form.bookRide'),
        deleteRide: t('rideshare.deleteRide'),
        confirmDelete: t('rideshare.confirmDelete'),
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
        <div className="min-h-screen bg-[rgb(250,252,255)] ">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-start">
                        <BackButton url={`/${lang}/rideshare`} />
                    </div>

                    <div className="flex justify-end">
                        <DeleteRideButton
                            rideKey={rideDetails.key}
                            driverEmail={rideDetails.driver_email}
                            lang={lang}
                            translations={{
                                deleteRide: translations.deleteRide,
                                confirmDelete: translations.confirmDelete,
                            }}
                        /></div>
                </div>

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
                            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(54,89,108,0.9)] to-[rgba(54,89,108,0.2)] z-10"></div>
                            <div className="relative z-20 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex-grow mb-4 sm:mb-0 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
                                            {t('rideshare.form.rideDetails')}
                                        </h1>

                                        <div className="flex space-x-2">
                                            {rideDetails.driver_license_uploaded && (
                                                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 shadow-md">
                                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                    </svg>
                                                </span>
                                            )}
                                            {rideDetails.driver_premium && (
                                                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md">
                                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </span>
                                            )}
                                            {rideDetails.driver_featured && (
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-md">
                                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
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

                                <div className="flex justify-between items-start w-full">

                                    <div className="flex-shrink-0">
                                        <div className="bg-white p-2 rounded-lg shadow-lg">
                                            <QRCodeSVG value={shareUrl} size={80} />
                                        </div>
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
                        <ShareButton rideId={rideDetails.key} lang={lang} />
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