import React from 'react'
import Link from 'next/link'

type Ride = {
  id: string
  from: string
  to: string
  date: string
  time: string
  seats: number
  price: number
}

type AvailableRidesProps = {
  rides: Ride[]
  translations: {
    [key: string]: string
  }
  lang: string
}

export default function AvailableRides({ rides, translations, lang }: AvailableRidesProps) {
  if (rides.length === 0) {
    return <p className="text-center text-[rgb(33,41,49)]">{translations['noRidesAvailable']}</p>
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <div key={ride.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[rgb(54,89,108)]">{ride.from} → {ride.to}</h3>
            <span className="text-[rgb(255,183,77)] font-bold">${ride.price}</span>
          </div>
          <div className="text-sm text-[rgb(33,41,49)]">
            <p>{ride.date} at {ride.time}</p>
            <p>{ride.seats} {translations['seatsAvailable']}</p>
          </div>
          <Link href={`/${lang}/rideshare/ride/${ride.id}`} className="mt-2 inline-block text-[rgb(54,89,108)] hover:text-[rgb(255,183,77)]">
            {translations['viewDetails']}
          </Link>
        </div>
      ))}
    </div>
  )
}