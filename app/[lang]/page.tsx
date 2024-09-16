import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await useTranslation(lang, 'common')

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen bg-[rgb(250,252,255)]">
            <main className="flex-grow">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center relative">
                    {/* <span className="text-[rgb(54,89,108)]">{t('welcome')} </span> */}
                    <span className="relative inline-block">
                        {/* <span className="text-[rgb(255,183,77)] text-sm">welcome to </span>  */}
                        <span className="text-[rgb(255,183,77)] ">We</span>
                        {/* <span className="text-[rgb(255,183,77)] text-sm">lcome to </span>  */}
                        <span className="text-[rgb(54,89,108)]">Sudbury</span><span className="text-lg text-[rgb(54,89,108)]">.com</span>
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-[rgb(255,183,77)]"></span>
                    </span>
                    <span className="absolute -top-6 -left-6 text-9xl text-[rgb(255,183,77)] opacity-10 font-extrabold">We</span>
                    <span className="absolute -bottom-6 -right-6 text-9xl text-[rgb(54,89,108)] opacity-10 font-extrabold">Sudbury</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-[rgb(33,41,49)] max-w-2xl mx-auto mb-12 text-center">{t('description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('lifestyle.title')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href={`/${lang}/lifestyle/shopping`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('lifestyle.shopping')}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/lifestyle/dining`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('lifestyle.dining')}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/lifestyle/housing`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('lifestyle.housing')}
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('rideshare.title')}</h2>
                        <p className="mb-4 text-[rgb(33,41,49)]">{t('rideshare.description')}</p>
                        <Link href={`/${lang}/rideshare`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded inline-block transition-colors">
                            {t('rideshare.cta')}
                        </Link>
                    </section>

                    <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('newcomer.title')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href={`/${lang}/newcomer/essentials`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('newcomer.essentials')}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/newcomer/culture`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('newcomer.culture')}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/newcomer/weather`} className="text-[rgb(33,41,49)] hover:text-[rgb(255,183,77)]">
                                    {t('newcomer.weather')}
                                </Link>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Useful Links section */}
                <section className="bg-[rgb(245,247,250)] rounded-lg shadow-md p-6 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('usefulLinks.title')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <a href={t('usefulLinks.cityWebsite.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {t('usefulLinks.cityWebsite.title')}
                        </a>
                        <a href={t('usefulLinks.publicTransport.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            {t('usefulLinks.publicTransport.title')}
                        </a>
                        <a href={t('usefulLinks.healthServices.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            {t('usefulLinks.healthServices.title')}
                        </a>
                        <a href={t('usefulLinks.localNews.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            {t('usefulLinks.localNews.title')}
                        </a>
                        <a href={t('usefulLinks.events.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {t('usefulLinks.events.title')}
                        </a>
                        <a href={t('usefulLinks.emergencyServices.url')} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg hover:bg-[rgb(255,183,77)] hover:text-white transition-colors">
                            <svg className="w-6 h-6 mr-2 text-[rgb(54,89,108)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            {t('usefulLinks.emergencyServices.title')}
                        </a>
                    </div>
                </section>

                <section className="bg-[rgb(245,247,250)] rounded-lg p-6 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-center text-[rgb(54,89,108)]">{t('featuredContent.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <Image src="/images/featured-1.jpg" alt={t('featuredContent.image1Alt')} width={400} height={300} className="rounded-lg mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-[rgb(54,89,108)]">{t('featuredContent.title1')}</h3>
                            <p className="text-[rgb(33,41,49)]">{t('featuredContent.description1')}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <Image src="/images/featured-2.jpg" alt={t('featuredContent.image2Alt')} width={400} height={300} className="rounded-lg mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-[rgb(54,89,108)]">{t('featuredContent.title2')}</h3>
                            <p className="text-[rgb(33,41,49)]">{t('featuredContent.description2')}</p>
                        </div>
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-[rgb(54,89,108)]">{t('cta.title')}</h2>
                    <p className="mb-6 text-[rgb(33,41,49)]">{t('cta.description')}</p>
                    <Link href={`/${lang}/signup`} className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full inline-block transition-colors">
                        {t('cta.button')}
                    </Link>
                </section>
            </main>
        </div>
    )
}