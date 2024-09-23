'use client';

import { useState, useEffect, useCallback, useRef } from 'react'
import { Ride } from '@/types'
import Link from 'next/link'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaUserFriends } from 'react-icons/fa';
import { gradientPairs } from '@/constants';
interface OfferedRidesProps {
    translations: Record<string, string>
    lang: string
    driverEmail: string | null
}

export default function OfferedRides({ translations, lang, driverEmail }: OfferedRidesProps) {
    const [rides, setRides] = useState<{ rideinfo: Ride, key: string }[]>([])
    const [page, setPage] = useState(1)
    const fetchedPages = useRef(new Set<number>())

    const fetchRides = useCallback(async () => {
        if (!driverEmail) {
            return; // Skip if this page has already been fetched
        }
        if (fetchedPages.current.has(page)) {
            return; // Skip if this page has already been fetched
        }
        fetchedPages.current.add(page)
        try {
            const response = await fetch(`/api/rides?page=${page}&limit=1000000000&driverEmail=${encodeURIComponent(driverEmail)}`)
            const data = await response.json()
            if (!data || !data.rides || data.rides.length === 0) {
                return
            }
            setRides(prevRides => [...prevRides, ...data.rides])
            setPage(prevPage => prevPage + 1)

        } catch (error) {
            console.log('Error fetching rides:', error)
        }
    }, [page, driverEmail])

    useEffect(() => {
        fetchRides()
    }, [driverEmail])


    return (<>
        {rides.length > 0 && (<>
            <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">Rides You&apos;ve Offered</h2>
            {rides.map((ride) => (
                <Link href={`/${lang}/rideshare/ride/${ride.key}`} key={ride.key} className="block">
                    <div className="rounded-lg shadow-md p-5 mb-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                      style={{
                        background: `linear-gradient(to right, ${gradientPairs[ride.rideinfo.gradientIndex||0][1]}, ${gradientPairs[ride.rideinfo.gradientIndex||0][2]})`
                    }}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-white">
                                <FaMapMarkerAlt className="inline-block mr-2 text-[rgb(255,183,77)]" />
                                {ride.rideinfo.from_city} <span className="mx-1 sm:mx-2 text-yellow-300">→</span> {ride.rideinfo.to_city}
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-white">
                            <p className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-white" />
                                {ride.rideinfo.date}
                            </p>
                            <p className="flex items-center">
                                <FaClock className="mr-2 text-white" />
                                {ride.rideinfo.time}
                            </p>
                            <p className="flex items-center">
                                <FaDollarSign className="mr-2 text-white" />
                                {ride.rideinfo.price}
                            </p>
                            <p className="flex items-center">
                                <FaUserFriends className="mr-2 text-white" />
                                {ride.rideinfo.seats} {translations['availableSeats']}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </>
        )
        }</>)



}