import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { key } = req.query
    if (!key || typeof key !== 'string') {
        return res.status(400).json({ error: 'Invalid key' })
    }

    try {
        const command = new GetObjectCommand({
            Bucket: 'wesudbury',
            Key: key,
        })
        const { Body, ContentType } = await s3Client.send(command)

        if (!Body || !ContentType) {
            return res.status(404).json({ error: 'Image not found' })
        }

        res.setHeader('Content-Type', ContentType)
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        // @ts-expect-error Body type from AWS SDK doesn't match expected stream type
        Body.pipe(res)
    } catch (error) {
        console.error('Error fetching image:', error)
        res.status(500).json({ error: 'Failed to fetch image' })
    }
}