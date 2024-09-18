import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { page = '1', limit = '10', driverEmail, filter = 'all' } = req.query

        const pageNumber = parseInt(page as string, 10)
        const limitNumber = parseInt(limit as string, 10)
        const offset = (pageNumber - 1) * limitNumber

        try {
            let query = supabase
                .from('rides')
                .select('*', { count: 'exact' })

            if (driverEmail) {
                query = query.eq('rideinfo->>driver_email', driverEmail)
                .is('del_at', null)  //已经删除的不显示
            }

            if (filter === 'available') {
                const now = new Date()
                const currentDate = now.toISOString().split('T')[0]
                const currentTime = now.toTimeString().slice(0, 5)
                query = query.or(
                    `rideinfo->>"date".gt.${currentDate}, and(rideinfo->>"date".eq.${currentDate}, rideinfo->>"time".gt.${currentTime})`)
                .is('del_at', null)  //已经删除的不显示
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(offset, offset + limitNumber - 1)

            if (error) {
                throw error
            }
            // const { data, error, count } = await supabase
            //     .from('rides')
            //     .select('*')
            //     .or(`rideinfo->>"date".gt.2024-09-18, and(rideinfo->>"date".eq.2024-09-18, rideinfo->>"time" .gt.18:30:00)`)
            //     .order('created_at', { ascending: true })
            //     .limit(10)
            // if (error) {
            //     throw error
            // }

            res.status(200).json({ rides: data, total: count })
        } catch (error) {
            console.error('Error fetching rides:', error)
            res.status(500).json({ error: 'Failed to fetch rides' })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}