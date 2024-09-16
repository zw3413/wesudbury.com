'use client';

import { useState, useEffect, useCallback } from 'react'
import { Ride } from '@/types'
import InfiniteScroll from 'react-infinite-scroll-component'

interface AvailableRidesProps {
  translations: Record<string, string>
  lang: string
}

export default function AvailableRides({ translations, lang }: AvailableRidesProps) {
  const [rides, setRides] = useState<Ride[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchRides = useCallback(async () => {
    try {
      const response = await fetch(`/api/rides?page=${page}&limit=10`)
      const data = await response.json()
      if (!data || !data.rides) {
        return []
      }
      if (data.rides.length === 0) {
        setHasMore(false)
      } else {
        setRides(prevRides => [...prevRides, ...data.rides])
        setPage(prevPage => prevPage + 1)
      }
    } catch (error) {
      console.log('Error fetching rides:', error)
      return []
    }
  }, [page])

  useEffect(() => {
    console.log('first time loading rides')
    fetchRides()
  }, [fetchRides])

  return (
    <InfiniteScroll
      dataLength={rides.length}
      next={fetchRides}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more rides to load.</p>}>
      {rides.map((ride) => (
        <div key={ride.key} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-semibold mb-2">{ride.from_location} to {ride.to_location}</h3>
          <p>{translations['date']}: {ride.date}</p>
          <p>{translations['time']}: {ride.time}</p>
          <p>{translations['price']}: ${ride.price}</p>
          <p>{translations['availableSeats']}: {ride.seats}</p>
          <a href={`/${lang}/rideshare/ride/${ride.key}`} className="text-blue-500 hover:underline">
            {translations['viewDetails']}
          </a>
        </div>
      ))}
    </InfiniteScroll>
  )
}