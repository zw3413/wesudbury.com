import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { rideId, passengerInfo } = req.body

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: decodeURIComponent(rideId),
          passenger_name: passengerInfo.name,
          passenger_email: passengerInfo.email,
          passenger_phone: passengerInfo.phone_number,
          booking_date: new Date().toISOString(),
        })

      if (error) throw error

      res.status(200).json({ message: 'Booking successful', data })
    } catch (error) {
      console.error('Error booking ride:', error)
      res.status(500).json({ error: 'Failed to book ride' })
    }
  } else if (req.method === 'GET') {
    try {
      const { ride_id } = req.body
      const decodedKey = decodeURIComponent(ride_id)

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('ride_id', decodedKey)

      if (error) {
        console.error('Error fetching bookings:', error)
        return null
      }
      res.status(200).json(data)
    } catch (error) {
      console.error('Error get bookings:', error)
      res.status(500).json({ error: 'Failed to get bookings' })
    }
  }
  else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
