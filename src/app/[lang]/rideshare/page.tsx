import { useTranslation } from '@/lib/i18n'
import RideshareForm from '@/components/RideshareForm'
import Map from '@/components/Map'

export default async function Rideshare({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang, 'rideshare')

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RideshareForm lang={lang} />
        <Map />
      </div>
    </main>
  )
}