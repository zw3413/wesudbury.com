import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const rideData = req.body

        // Validate the required fields
        if (!rideData.key || !rideData.userEmail || !rideData.from || !rideData.to || !rideData.date || !rideData.time) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        try {
            // Insert the ride data into the 'rides' table
            const { data, error } = await supabase
                .from('rides')
                .upsert({
                    key: rideData.key,
                    user_email: rideData.userEmail,
                    from_location: rideData.from,
                    to_location: rideData.to,
                    date: rideData.date,
                    time: rideData.time,
                    estimated_travel_time: rideData.estimatedTravelTime,
                    flexible_departure: rideData.flexibleDeparture,
                    seats: rideData.seats,
                    price: rideData.price,
                    routine: rideData.routine,
                    frequency: rideData.frequency,
                    notes: rideData.notes,
                    smoking: rideData.smoking,
                    pet_friendly: rideData.petFriendly,
                    preferred_passenger_gender: rideData.preferredPassengerGender,
                    max_detour_distance: rideData.maxDetourDistance,
                    created_at: rideData.createdAt,
                })
                .select()

            if (error) {
                throw error
            }

            res.status(200).json({ message: 'Ride offer created successfully', data })
        } catch (error) {
            console.error('Error saving ride data:', error)
            res.status(500).json({ error: 'Failed to save ride data' })
        }
    } else if (req.method === 'GET') {
        const { key } = req.query

        if (typeof key !== 'string') {
            return res.status(400).json({ error: 'Invalid ride key' })
        }

        try {
            const { data, error } = await supabase
                .from('rides')
                .select('*')
                .eq('key', key)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Ride not found' })
                }
                throw error
            }

            if (!data) {
                return res.status(404).json({ error: 'Ride not found' })
            }

            res.status(200).json(data)
        } catch (error) {
            console.error('Error fetching ride data:', error)
            res.status(500).json({ error: 'Failed to fetch ride data' })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}