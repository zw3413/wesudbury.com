import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to process form data' })
      }

      const driverInfo = typeof fields.driverInfo === 'string' 
        ? JSON.parse(fields.driverInfo) 
        : (Array.isArray(fields.driverInfo) ? fields.driverInfo[0] : fields.driverInfo) || {}

      const vehicleInfo = typeof fields.vehicleInfo === 'string' 
        ? JSON.parse(fields.vehicleInfo) 
        : (Array.isArray(fields.vehicleInfo) ? fields.vehicleInfo[0] : fields.vehicleInfo) || {}

      // Handle file uploads (license and vehicle picture)
      if (files.licenseFile) {
        const licenseFile = Array.isArray(files.licenseFile) ? files.licenseFile[0] : files.licenseFile as formidable.File
        // Upload license file to Supabase storage
        const { data, error } = await supabase.storage
          .from('licenses')
          .upload(`${driverInfo.email}/license.${licenseFile.originalFilename?.split('.').pop()}`, fs.createReadStream(licenseFile.filepath))
        
        if (error) {
          return res.status(500).json({ error: 'Failed to upload license file' })
        }
        driverInfo.licenseFileUrl = data?.path
      }

      if (files.vehiclePicture) {
        const vehiclePictureFile = Array.isArray(files.vehiclePicture) ? files.vehiclePicture[0] : files.vehiclePicture
        // Upload vehicle picture to Supabase storage
        const { data, error } = await supabase.storage
          .from('vehicle-pictures')
          .upload(`${driverInfo.email}/vehicle.${vehiclePictureFile.originalFilename?.split('.').pop()}`, fs.createReadStream(vehiclePictureFile.filepath))
        
        if (error) {
          return res.status(500).json({ error: 'Failed to upload vehicle picture' })
        }
        vehicleInfo.pictureUrl = data?.path
      }

      // Save driver and vehicle info to the database
      const { data, error } = await supabase
        .from('drivers')
        .upsert({ 
          email: driverInfo.email,
          driver_info: driverInfo,
          vehicle_info: vehicleInfo
        })
        .select()

      if (error) {
        return res.status(500).json({ error: 'Failed to save driver info' })
      }

      return res.status(200).json({ message: 'Driver info saved successfully', data })
    })
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