'use client';

import { useState, useEffect, useCallback, useRef } from 'react'
import { Ride } from '@/types'
import InfiniteScroll from 'react-infinite-scroll-component'

interface AvailableRidesProps {
    translations: Record<string, string>
    lang: string
}

export default function AvailableRides({ translations, lang }: AvailableRidesProps) {
    const [rides, setRides] = useState<{rideinfo: Ride, key: string}[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const fetchedPages = useRef(new Set<number>())

    const fetchRides = useCallback(async () => {
        if (fetchedPages.current.has(page)) {
            return; // Skip if this page has already been fetched
        }
        fetchedPages.current.add(page)
        try {
            const response = await fetch(`/api/rides?page=${page}&limit=10`)
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

    return (
        <InfiniteScroll
            dataLength={rides.length}
            next={fetchRides}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more rides to load.</p>}>
            {rides.map((ride) => (
                <div key={ride.key} className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 className="text-xl font-semibold mb-2">{ride.rideinfo.from_city} to {ride.rideinfo.to_city}</h3>
                    <p>{translations['date']}: {ride.rideinfo.date}</p>
                    <p>{translations['time']}: {ride.rideinfo.time}</p>
                    <p>{translations['price']}: ${ride.rideinfo.price}</p>
                    <p>{translations['availableSeats']}: {ride.rideinfo.seats}</p>
                    <a href={`/${lang}/rideshare/ride/${ride.key}`} className="text-blue-500 hover:underline">
                        {translations['viewDetails']}
                    </a>
                </div>
            ))}
        </InfiniteScroll>
    )
}