import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { page = '1', limit = '10' } = req.query

        const pageNumber = parseInt(page as string, 10)
        const limitNumber = parseInt(limit as string, 10)
        const offset = (pageNumber - 1) * limitNumber

        try {
            const { data, error, count } = await supabase
                .from('rides')
                .select('*', { count: 'exact' })
                .range(offset, offset + limitNumber - 1)
                .order('created_at', { ascending: false })

            if (error) {
                throw error
            }

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