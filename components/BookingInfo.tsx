'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Booking {
  id: number
  ride_id: string
  passenger_name: string
  passenger_email: string
  passenger_phone: string
  booking_date: string
  status: string
}

interface BookingInfoProps {
  rideId: string
  driverEmail: string
  lang: string
}

export default function BookingInfo({ rideId, driverEmail, lang }: BookingInfoProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation(lang, { keyPrefix: 'common' }) // Updated to use keyPrefix

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/book?ride_id=${rideId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError('Error fetching bookings')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [rideId])

  const [isDriver, setIsDriver] = useState(false);
  const [passengerEmail, setPassengerEmail] = useState("")
  
  useEffect(()=>{
    if (typeof window !== 'undefined') {
    const pEmail =localStorage.getItem('passengerEmail')
    if(pEmail){
        setPassengerEmail(pEmail)
    }
    const dEmail =localStorage.getItem('driverEmail')
    if(dEmail){
        //setDriverEmail(dEmail)
        setIsDriver(true)
    }
    }
  },[])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDriver(localStorage.getItem('driverEmail') === driverEmail);
    }
  }, [driverEmail]);


  if (isLoading) {
    return <div>{t('loading')}</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  const filteredBookings = isDriver
    ? bookings
    : bookings.filter(booking => booking.passenger_email === passengerEmail)

  if (filteredBookings.length === 0) {
    return <div>{t('noBookings')}</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-[rgb(40,76,96)]">{t('bookings')}</h2>
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
            <p><strong>{t('passengerName')}:</strong> {booking.passenger_name}</p>
            {isDriver && (
              <>
                <p><strong>{t('passengerEmail')}:</strong> {booking.passenger_email}</p>
                <p><strong>{t('passengerPhone')}:</strong> {booking.passenger_phone}</p>
              </>
            )}
            <p><strong>{t('bookingDate')}:</strong> {new Date(booking.booking_date).toLocaleString()}</p>
            <p><strong>{t('status')}:</strong> {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}