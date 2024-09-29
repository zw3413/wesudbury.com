'use client'

import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { FaCar, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Home({ params: { lang } }: { params: { lang: string } }) {
    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)

    useEffect(() => {
        const LoadTranslations = async () => {
            const { t } = await useTranslation(lang, 'common')
            setT(() => t)
        }
        LoadTranslations()
    }, [lang])

    return (
        <div className="min-h-screen bg-[rgb(250,252,255)]">
            <header className="bg-gradient-to-r from-[rgb(40,76,96)] to-[rgb(60,96,116)] text-white py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center relative">
                        <span className="text-[rgb(255,183,77)]">We</span>
                        <span className="text-white">Sudbury</span>
                        <span className="text-lg">.com</span>
                        <span className="absolute -top-6 -left-6 text-9xl text-[rgb(255,183,77)] opacity-10 font-extrabold">We</span>
                        <span className="absolute -bottom-6 -right-6 text-9xl text-white opacity-10 font-extrabold">Sudbury</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-center">{t('description')}</p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(40,76,96)]">{t('featuredServices')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FaCar className="w-12 h-12 mb-1 text-[rgb(255,183,77)]" />}
                            title={t('rideshare.title')}
                            description={t('rideshare.description')}
                            link={`/${lang}/rideshare`}
                            linkText={t('rideshare.cta')}
                        />
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md p-8 mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(40,76,96)]">{t('usefulLinks.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <LinkCategory title={t('usefulLinks.cityServices')} links={[
                            { title: t('usefulLinks.cityWebsite.title'), url: t('usefulLinks.cityWebsite.url'), icon: 'building' },
                            { title: t('usefulLinks.emergencyServices.title'), url: t('usefulLinks.emergencyServices.url'), icon: 'ambulance' },
                            { title: t('usefulLinks.publicTransport.title'), url: t('usefulLinks.publicTransport.url'), icon: 'bus' },
                        ]} />
                        <LinkCategory title={t('usefulLinks.healthWellness')} links={[
                            { title: t('usefulLinks.healthServices.title'), url: t('usefulLinks.healthServices.url'), icon: 'hospital' },
                        ]} />
                        <LinkCategory title={t('usefulLinks.communityCulture')} links={[
                            { title: t('usefulLinks.events.title'), url: t('usefulLinks.events.url'), icon: 'calendar' },
                            { title: t('usefulLinks.sudburychineselife.title'), url: t('usefulLinks.sudburychineselife.url'), icon: 'users' },
                        ]} />
                        <LinkCategory title={t('usefulLinks.newsMedia')} links={[
                            { title: t('usefulLinks.localNews.title'), url: t('usefulLinks.localNews.url'), icon: 'newspaper' },
                        ]} />
                        <LinkCategory title={t('usefulLinks.education.title')} links={[
                            { title: t('usefulLinks.education.laurentianUniversity.title'), url: t('usefulLinks.education.laurentianUniversity.url'), icon: 'graduation-cap' },
                            { title: t('usefulLinks.education.cambrianCollege.title'), url: t('usefulLinks.education.cambrianCollege.url'), icon: 'school' },
                            { title: t('usefulLinks.education.collegeBoreal.title'), url: t('usefulLinks.education.collegeBoreal.url'), icon: 'school' },
                            { title: t('usefulLinks.education.rainbowSchools.title'), url: t('usefulLinks.education.rainbowSchools.url'), icon: 'chalkboard-teacher' },
                        ]} />
                        <LinkCategory title={t('usefulLinks.businessEmployment.title')} links={[
                            { title: t('usefulLinks.businessEmployment.chamberOfCommerce.title'), url: t('usefulLinks.businessEmployment.chamberOfCommerce.url'), icon: 'briefcase' },
                            { title: t('usefulLinks.businessEmployment.regionalBusinessCentre.title'), url: t('usefulLinks.businessEmployment.regionalBusinessCentre.url'), icon: 'building' },
                            { title: t('usefulLinks.businessEmployment.samssa.title'), url: t('usefulLinks.businessEmployment.samssa.url'), icon: 'industry' },
                            { title: t('usefulLinks.businessEmployment.employmentOntario.title'), url: t('usefulLinks.businessEmployment.employmentOntario.url'), icon: 'user-tie' },
                        ]} />
                    </div>
                </section>
            </main>
        </div>
    )
}

const FeatureCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link?: string, linkText?: string }) => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
        <div className="mb-1 flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(255,183,77)] bg-opacity-20">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[rgb(40,76,96)]">{title}</h3>
        <p className="text-[rgb(33,41,49)] mb-4">{description}</p>
        {link && linkText && (
            <Link href={link} className="inline-block bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded transition-colors">
                {linkText}
            </Link>
        )}
    </div>
)

const LinkCategory = ({ title, links }: { title: string, links: { title: string, url: string, icon: string }[] }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left bg-[rgb(40,76,96)] text-white hover:bg-[rgb(60,96,116)] transition-colors"
            >
                <h3 className="text-xl font-semibold">{title}</h3>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="p-4 space-y-2">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-2 rounded-md hover:bg-[rgb(255,183,77)] group"
                            >
                                <i className={`fas fa-${link.icon} w-6 h-6 mr-3 text-[rgb(255,183,77)] group-hover:text-white transition-colors`}></i>
                                <span className="text-[rgb(33,41,49)] group-hover:text-white transition-colors">{link.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

