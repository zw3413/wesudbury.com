'use client';

import { useState, useEffect, useCallback, useRef } from 'react'
import { Ride } from '@/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaUserFriends } from 'react-icons/fa';

interface AvailableRidesProps {
    translations: Record<string, string>
    lang: string
}

export default function AvailableRides({ translations, lang }: AvailableRidesProps) {
    const [rides, setRides] = useState<{ rideinfo: Ride, key: string }[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const fetchedPages = useRef(new Set<number>())

    const fetchRides = useCallback(async () => {
        if (fetchedPages.current.has(page)) {
            return; // Skip if this page has already been fetched
        }
        fetchedPages.current.add(page)
        try {
            const response = await fetch(`/api/rides?filter=available&page=${page}&limit=10`)
            const data = await response.json()
            if (!data || !data.rides || data.rides.length === 0) {
                setHasMore(false)
                return
            }

            setRides(prevRides => [...prevRides, ...data.rides])
            setPage(prevPage => prevPage + 1)

        } catch (error) {
            setHasMore(false)
            console.log('Error fetching rides:', error)
        }
    }, [page])

    useEffect(() => {
        fetchRides()
    }, [])

    return (<>
        <InfiniteScroll
            dataLength={rides.length}
            next={fetchRides}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            {rides.map((ride) => (
                <Link href={`/${lang}/rideshare/ride/${ride.key}`} key={ride.key} className="block">
                    <div className="bg-white rounded-lg shadow-md p-5 mb-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                                <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" />
                                {ride.rideinfo.from_city} to {ride.rideinfo.to_city}
                            </h3>

                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <p className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                {ride.rideinfo.date}
                            </p>
                            <p className="flex items-center">
                                <FaClock className="mr-2 text-gray-400" />
                                {ride.rideinfo.time}
                            </p>
                            <p className="flex items-center">
                                <FaDollarSign className="mr-2 text-gray-400" />
                                {ride.rideinfo.price}
                            </p>
                            <p className="flex items-center">
                                <FaUserFriends className="mr-2 text-gray-400" />
                                {ride.rideinfo.seats} {translations['availableSeats']}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </InfiniteScroll>
        {(!hasMore) && (<p>No more rides to load.</p>)}       </>
    )
}