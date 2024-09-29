'use client';

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { setLanguage } from '@/lib/i18n'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
]

const LanguageSwitcher: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (langCode: string) => {
    setLanguage(langCode)
    if (pathname) {
      const newPathname = pathname.replace(/^\/[^\/]+/, `/${langCode}`)
      router.push(newPathname)
    }
  }

  return (
    <div className="flex space-x-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {lang.name}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher