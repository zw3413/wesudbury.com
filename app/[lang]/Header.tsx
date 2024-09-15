'use client'

import Link from 'next/link'
import { useState } from 'react'

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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-[rgb(54,89,108)] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={`/${lang}`} className="text-xl font-bold">WeSudbury</Link>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Link href={`/${lang}`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.home}</Link></li>
            <li><Link href={`/${lang}/lifestyle`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.lifestyle}</Link></li>
            <li><Link href={`/${lang}/map`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.map}</Link></li>
            <li><Link href={`/${lang}/rideshare`} className="hover:text-[rgb(255,183,77)] transition-colors">{translations.rideshare}</Link></li>
          </ul>
        </nav>
      </div>
      {menuOpen && (
        <nav className="md:hidden bg-[rgb(44,79,98)]">
          <ul className="flex flex-col p-4 space-y-2">
            <li><Link href={`/${lang}`} className="block py-2 hover:text-[rgb(255,183,77)] transition-colors" onClick={() => setMenuOpen(false)}>{translations.home}</Link></li>
            <li><Link href={`/${lang}/lifestyle`} className="block py-2 hover:text-[rgb(255,183,77)] transition-colors" onClick={() => setMenuOpen(false)}>{translations.lifestyle}</Link></li>
            <li><Link href={`/${lang}/map`} className="block py-2 hover:text-[rgb(255,183,77)] transition-colors" onClick={() => setMenuOpen(false)}>{translations.map}</Link></li>
            <li><Link href={`/${lang}/rideshare`} className="block py-2 hover:text-[rgb(255,183,77)] transition-colors" onClick={() => setMenuOpen(false)}>{translations.rideshare}</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}