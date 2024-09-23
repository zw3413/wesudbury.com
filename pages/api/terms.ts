import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'public', 'asserts', 'text', 'policy', 'carpool_terms_and_conditions.md')
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      res.status(200).json({ content: fileContents })
    } catch (error) {
      console.error('Error reading terms and conditions file:', error)
      res.status(500).json({ error: 'Failed to read terms and conditions' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}