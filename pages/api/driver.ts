import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const config = {
  api: {
    bodyParser: false,
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to process form data' })
      }

      let driverInfo, vehicleInfo;

      try {
        driverInfo = JSON.parse(Array.isArray(fields.driverInfo) ? fields.driverInfo[0] : fields.driverInfo || '{}');
        vehicleInfo = JSON.parse(Array.isArray(fields.vehicleInfo) ? fields.vehicleInfo[0] : fields.vehicleInfo || '{}');
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(400).json({ error: 'Invalid JSON in form data' });
      }

      // Handle vehicle picture upload
      if (files.vehiclePicture) {
        const vehiclePictureFile = Array.isArray(files.vehiclePicture) ? files.vehiclePicture[0] : files.vehiclePicture;
        const fileContent = fs.readFileSync(vehiclePictureFile.filepath);
        const fileExtension = vehiclePictureFile.originalFilename?.split('.').pop();
        const fileName = `${driverInfo.email}/vehicle.${fileExtension}`;

        const uploadParams = {
          Bucket: 'wesudbury',
          Key: fileName,
          Body: fileContent,
          ContentType: vehiclePictureFile.mimetype ?? undefined,
        };

        try {
          await s3Client.send(new PutObjectCommand(uploadParams));
          vehicleInfo.pictureUrl = fileName;
        } catch (error) {
          console.error('Error uploading to R2:', error);
          return res.status(500).json({ error: 'Failed to upload vehicle picture' });
        }
      }

      // Save driver and vehicle info to the database
      const { data, error } = await supabase
        .from('drivers')
        .upsert({ 
          email: driverInfo.email,
          driver_info: driverInfo,
          vehicle_info: vehicleInfo
        })
        .select();

      if (error) {
        return res.status(500).json({ error: 'Failed to save driver info' });
      }

      return res.status(200).json({ message: 'Driver info saved successfully', data });
    });
  } else if (req.method === 'GET') {
    const { email } = req.query

    if (typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Driver not found' })
    }

    return res.status(200).json(data)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}