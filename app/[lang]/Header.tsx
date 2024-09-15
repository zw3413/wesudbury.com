'use client'

import Link from 'next/link'

type HeaderProps = {
  lang: string
  translations: {
    home: string
    lifestyle: string
    map: string
    rideshare: string
  }
}

export default function Header({ lang, translations }: HeaderProps) {
  return (
    <header className="bg-[rgb(54,89,108)] text-white shadow-md hidden md:block">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={`/${lang}`} className="text-xl font-bold">WeSudbury</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href={`/${lang}`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.home}</Link></li>
            <li><Link href={`/${lang}/lifestyle`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.lifestyle}</Link></li>
            <li><Link href={`/${lang}/map`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.map}</Link></li>
            <li><Link href={`/${lang}/rideshare`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.rideshare}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}