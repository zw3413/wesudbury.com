import { useTranslation } from '@/lib/i18n'
import RideRequestForm from '@/components/RideRequestForm'

export default async function RequestRide({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[rgb(54,89,108)] text-center">{t('rideshare.requestRide')}</h1>
      <RideRequestForm lang={lang} />
    </div>
  )
}