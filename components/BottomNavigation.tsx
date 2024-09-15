'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type BottomNavigationProps = {
  lang: string
  translations: {
    home: string
    lifestyle: string
    map: string
    rideshare: string
  }
}

export default function BottomNavigation({ lang, translations }: BottomNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === `/${lang}${path}`

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[rgb(54,89,108)] text-white py-2 px-4 md:hidden z-50">
      <ul className="flex justify-around items-center">
        <li>
          <Link href={`/${lang}`} className={`flex flex-col items-center ${isActive('') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">{translations.home}</span>
          </Link>
        </li>
        <li>
          <Link href={`/${lang}/lifestyle`} className={`flex flex-col items-center ${isActive('/lifestyle') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
            <span className="text-xs">{translations.lifestyle}</span>
          </Link>
        </li>
        <li>
          <Link href={`/${lang}/map`} className={`flex flex-col items-center ${isActive('/map') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs">{translations.map}</span>
          </Link>
        </li>
        <li>
          <Link href={`/${lang}/rideshare`} className={`flex flex-col items-center ${isActive('/rideshare') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs">{translations.rideshare}</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}