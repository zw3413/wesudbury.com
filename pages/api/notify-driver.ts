import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { rideId, driverEmail, passengerName, passengerEmail, passengerPhone, fromCoordinate, toCoordinate } = req.body
    console.log(fromCoordinate, toCoordinate)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: driverEmail,
        subject: 'New Ride Booking Confirmation Required',
        text: `
          A new booking has been made for your ride:
          
          Ride ID: ${rideId}
          https://www.wesudbury.com/rideshare/ride/${rideId}
          Passenger Details:
          Name: ${passengerName}
          Email: ${passengerEmail}
          Phone: ${passengerPhone}
          
          Please log in to your account to confirm or reject this booking.
        `,
        html: `
          <h1>New Ride Booking Confirmation Required</h1>
          <p>A new booking has been made for your ride:</p>
          <ul>
            <li><strong>Ride ID:</strong><a href="https://www.wesudbury.com/rideshare/ride/${rideId}"> ${rideId}</a></li>
          </ul>
          <h2>Passenger Details:</h2>
          <ul>
            <li><strong>Name:</strong> ${passengerName}</li>
            <li><strong>Email:</strong> ${passengerEmail}</li>
            <li><strong>Phone:</strong> ${passengerPhone}</li>
          </ul>
          <p>Please navigate to the ride page to confirm or reject this booking.</p>
        `,
      })

      res.status(200).json({ message: 'Notification sent to driver' })
    } catch (error) {
      console.error('Error sending notification to driver:', error)
      res.status(500).json({ error: 'Failed to send notification to driver' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}