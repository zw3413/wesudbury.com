import { redirect } from 'next/navigation'
import { getLanguage } from '@/lib/i18n'

export default function Home() {
  const detectedLang = getLanguage()
  redirect(`/${detectedLang}`)
}
