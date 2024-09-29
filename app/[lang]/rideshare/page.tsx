'use client'

import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { FaSearch, FaPlus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import BackButton from '@/components/BackButton'
import dynamic from 'next/dynamic'

const AvailableRides = dynamic(() => import('@/components/AvailableRides'), { ssr: false })

export default function Rideshare({ params: { lang } }: { params: { lang: string } }) {
	const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)

	useEffect(() => {
		const LoadTranslations = async () => {
			const { t } = await useTranslation(lang, 'common')
			setT(() => t)
		}
		LoadTranslations()
	}, [lang])

	const translations = [
		'date',
		'time',
		'price',
		'availableSeats',
		'viewDetails',
	].reduce((acc, key) => {
		acc[key] = t(key)
		return acc
	}, {} as Record<string, string>)

	return (
		<div className="min-h-screen bg-[rgb(250,252,255)]">
			<header className="bg-gradient-to-r from-[rgb(40,76,96)] to-[rgb(60,96,116)] text-white py-20 relative overflow-hidden">
				<div className="container mx-auto px-4 relative z-10">
					<BackButton url={`/${lang}/`} />
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center relative">
						<span className="text-[rgb(255,183,77)]">Carpool</span>
						{/* <span className="text-white"></span> */}
						<span className="absolute -top-6 -left-6 text-9xl text-[rgb(255,183,77)] opacity-10 font-extrabold">We</span>
						<span className="absolute -bottom-6 -right-6 text-9xl text-white opacity-10 font-extrabold">Sudbury</span>
					</h1>
					<p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-center">
						{t('rideshare.description')}
					</p>
				</div>
			</header>

			<main className="container mx-auto px-4 py-12">
				<section className="mb-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Link href={`/${lang}/rideshare/offer`} className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow">
							<div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(255,183,77)] bg-opacity-20">
								<FaPlus className="w-8 h-8 text-[rgb(255,183,77)]" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-[rgb(40,76,96)]">{t('rideshare.offer')}</h3>
							<p className="text-[rgb(33,41,49)]">{t('rideshare.offerDescription')}</p>
						</Link>
						<Link href={`/${lang}/rideshare/request`} className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow">
							<div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(255,183,77)] bg-opacity-20">
								<FaSearch className="w-8 h-8 text-[rgb(255,183,77)]" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-[rgb(40,76,96)]">{t('rideshare.request')}</h3>
							<p className="text-[rgb(33,41,49)]">{t('rideshare.requestDescription')}</p>
						</Link>
					</div>
				</section>

				<section className="bg-white rounded-lg shadow-md p-2 mb-16">
					<h2 className="text-3xl font-bold mb-8 text-center text-[rgb(40,76,96)]">{t('rideshare.availableCarpool')}</h2>
					<AvailableRides translations={translations} lang={lang} />
				</section>
			</main>
		</div>
	)
}