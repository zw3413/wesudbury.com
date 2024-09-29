'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaCar } from 'react-icons/fa';
type BottomNavigationProps = {
  lang: string
  translations: {
    home: string
    lifestyle: string
    map: string
    carpool: string
  }
}

export default function BottomNavigation({ lang, translations }: BottomNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === `/${lang}${path}`

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[rgb(40,76,96)] text-white py-2 px-4 md:hidden z-40">
      <ul className="flex justify-around items-center">
        <li>
          <Link href={`/${lang}`} className={`flex flex-col items-center ${isActive('') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <FaHome className="h-6 w-6" />
            <span className="text-xs">{translations.home}</span>
          </Link>
        </li>

        <li>
          <Link href={`/${lang}/rideshare`} className={`flex flex-col items-center ${isActive('/rideshare') ? 'text-[rgb(255,183,77)]' : ''}`}>
            <FaCar className="h-6 w-6" />
            <span className="text-xs">{translations.carpool}</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}