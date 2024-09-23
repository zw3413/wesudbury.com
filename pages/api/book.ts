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
          ride_id: rideId,
          passenger_name: passengerInfo.name,
          passenger_email: passengerInfo.email,
          passenger_phone: passengerInfo.phone,
          booking_date: new Date().toISOString(),
        })

      if (error) throw error

      res.status(200).json({ message: 'Booking successful', data })
    } catch (error) {
      console.error('Error booking ride:', error)
      res.status(500).json({ error: 'Failed to book ride' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}