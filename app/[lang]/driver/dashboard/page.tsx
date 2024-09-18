import { useTranslation } from '@/lib/i18n'
import OfferedRides from '@/components/OfferedRides'

export default async function DriverDashboard({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await useTranslation(lang, 'common')
    const driverEmail = 'driver@example.com' // Replace this with the actual driver's email, perhaps from a session or context

    const translations = {
        offeredRides: t('driver.offeredRides'),
        availableSeats: t('rideshare.availableSeats'),
        noOfferedRides: t('driver.noOfferedRides'),
        noMoreRides: t('driver.noMoreRides'),
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t('driver.dashboard')}</h1>
            <OfferedRides translations={translations} lang={lang} driverEmail={driverEmail} />
        </div>
    )
}