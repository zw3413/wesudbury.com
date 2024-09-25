import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    const decodedKey = decodeURIComponent(email as string).toLowerCase()
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, email, phone_number')
        .eq('email', decodedKey)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}