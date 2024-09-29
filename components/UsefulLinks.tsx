'use client'

import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type LinkCategoryProps = {
    title: string
    links: { title: string; url: string; icon: string }[]
}

const LinkCategory: React.FC<LinkCategoryProps> = ({ title, links }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left bg-[rgb(40,76,96)] text-white hover:bg-[rgb(60,96,116)] transition-colors"
            >
                <h3 className="text-xl font-semibold">{title}</h3>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <ul className="p-4 space-y-2">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-2 rounded-md hover:bg-[rgb(255,183,77)] hover:text-white transition-colors group"
                            >
                                <i className={`fas fa-${link.icon} w-6 h-6 mr-3 text-[rgb(255,183,77)] group-hover:text-white transition-colors`} />
                                <span className="text-[rgb(33,41,49)] group-hover:text-white transition-colors">{link.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

type UsefulLinksProps = {
    t: (key: string) => string
}

const UsefulLinks: React.FC<UsefulLinksProps> = ({ t }) => {
    return (
        <section className="bg-[rgb(245,247,250)] rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(40,76,96)]">{t('usefulLinks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LinkCategory
                    title={t('usefulLinks.cityServices')}
                    links={[
                        { title: t('usefulLinks.cityWebsite.title'), url: t('usefulLinks.cityWebsite.url'), icon: 'building' },
                        { title: t('usefulLinks.emergencyServices.title'), url: t('usefulLinks.emergencyServices.url'), icon: 'ambulance' },
                        { title: t('usefulLinks.publicTransport.title'), url: t('usefulLinks.publicTransport.url'), icon: 'bus' },
                    ]}
                />
                <LinkCategory
                    title={t('usefulLinks.healthWellness')}
                    links={[{ title: t('usefulLinks.healthServices.title'), url: t('usefulLinks.healthServices.url'), icon: 'hospital' }]}
                />
                <LinkCategory
                    title={t('usefulLinks.communityCulture')}
                    links={[
                        { title: t('usefulLinks.events.title'), url: t('usefulLinks.events.url'), icon: 'calendar' },
                        { title: t('usefulLinks.sudburychineselife.title'), url: t('usefulLinks.sudburychineselife.url'), icon: 'users' },
                    ]}
                />
                <LinkCategory
                    title={t('usefulLinks.newsMedia')}
                    links={[{ title: t('usefulLinks.localNews.title'), url: t('usefulLinks.localNews.url'), icon: 'newspaper' }]}
                />
                <LinkCategory
                    title={t('usefulLinks.education.title')}
                    links={[
                        { title: t('usefulLinks.education.laurentianUniversity.title'), url: t('usefulLinks.education.laurentianUniversity.url'), icon: 'graduation-cap' },
                        { title: t('usefulLinks.education.cambrianCollege.title'), url: t('usefulLinks.education.cambrianCollege.url'), icon: 'school' },
                        { title: t('usefulLinks.education.collegeBoreal.title'), url: t('usefulLinks.education.collegeBoreal.url'), icon: 'school' },
                        { title: t('usefulLinks.education.rainbowSchools.title'), url: t('usefulLinks.education.rainbowSchools.url'), icon: 'chalkboard-teacher' },
                    ]}
                />
                <LinkCategory
                    title={t('usefulLinks.businessEmployment.title')}
                    links={[
                        { title: t('usefulLinks.businessEmployment.chamberOfCommerce.title'), url: t('usefulLinks.businessEmployment.chamberOfCommerce.url'), icon: 'briefcase' },
                        { title: t('usefulLinks.businessEmployment.regionalBusinessCentre.title'), url: t('usefulLinks.businessEmployment.regionalBusinessCentre.url'), icon: 'building' },
                        { title: t('usefulLinks.businessEmployment.samssa.title'), url: t('usefulLinks.businessEmployment.samssa.url'), icon: 'industry' },
                        { title: t('usefulLinks.businessEmployment.employmentOntario.title'), url: t('usefulLinks.businessEmployment.employmentOntario.url'), icon: 'user-tie' },
                    ]}
                />
            </div>
        </section>
    )
}

export default UsefulLinks