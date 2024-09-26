import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { BookingType } from '@/types'


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const { rideId, passengerInfo } = req.body

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: decodeURIComponent(rideId),
          passenger_name: passengerInfo.name,
          passenger_email: passengerInfo.email,
          passenger_phone: passengerInfo.phone_number,
          booking_date: new Date().toISOString(),
        })

      if (error) throw error

      res.status(200).json({ message: 'Booking successful', data })
    } catch (error) {
      console.error('Error booking ride:', error)
      res.status(500).json({ error: 'Failed to book ride' })
    }
  } else if (req.method === 'GET') {
    try {
      const { ride_id } = req.query
      const decodedKey = decodeURIComponent(ride_id as string)

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('ride_id', decodedKey)
        .order('status')

      if (error) {
        console.error('Error fetching bookings:', error)
        return null
      }
      res.status(200).json(data)
    } catch (error) {
      console.error('Error get bookings:', error)
      res.status(500).json({ error: 'Failed to get bookings' })
    }
  } else if (req.method === 'PUT') {
    const { bookingId, status, rejectReason } = req.body

    try {
      // Define a more specific type for updateData
      const updateData: { status: string; reject_reason?: string } = { status };
      if (rejectReason) {
        updateData.reject_reason = rejectReason;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select('*, rides(*)') // Select all fields from bookings and related ride info
        .single()

      if (error) throw error

      // Send email notifications
      await sendStatusChangeNotification(data)

      res.status(200).json({ message: 'Booking status updated successfully', data })
    } catch (error) {
      console.error('Error updating booking status:', error)
      res.status(500).json({ error: 'Failed to update booking status' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function sendStatusChangeNotification(booking: BookingType) {
  const statusMessages = {
    '2': 'confirmed',
    '3': 'rejected',
    '4': 'cancelled'
  }

  const statusMessage = statusMessages[booking.status as keyof typeof statusMessages] || 'updated'

  const subject = `[NO-REPLY] Ride Booking ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`
  const text = `
    Your ride booking has been ${statusMessage}.
    
    Ride Details:
    From: ${booking.rides.from_city}
    To: ${booking.rides.to_city}
    Date: ${booking.rides.date}
    Time: ${booking.rides.time}
    
    Passenger: ${booking.passenger_name}
    
    ${booking.status === '3' && booking.reject_reason ? `Rejection Reason: ${booking.reject_reason}` : ''}
    
    For more details, please visit: https://www.wesudbury.com/rideshare/ride/${booking.ride_id}
    
    If you need any help, please contact elvin@wesudbury.com
  `
  const html = `
    <h1>Ride Booking ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}</h1>
    <p>Your ride booking has been ${statusMessage}.</p>
    <h2>Ride Details:</h2>
    <ul>
      <li><strong>From:</strong> ${booking.rides.from_city}</li>
      <li><strong>To:</strong> ${booking.rides.to_city}</li>
      <li><strong>Date:</strong> ${booking.rides.date}</li>
      <li><strong>Time:</strong> ${booking.rides.time}</li>
    </ul>
    <p><strong>Passenger:</strong> ${booking.passenger_name}</p>
    ${booking.status === '3' && booking.reject_reason ? `<p><strong>Rejection Reason:</strong> ${booking.reject_reason}</p>` : ''}
    <p>For more details, please visit: <a href="https://www.wesudbury.com/rideshare/ride/${booking.ride_id}">Ride Details</a></p>
    <p>If you need any help, please contact <a href="mailto:elvin@wesudbury.com">elvin@wesudbury.com</a></p>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: [booking.passenger_email, booking.rides.driver_email],
      subject,
      text,
      html,
    })
  } catch (error) {
    console.error('Error sending notification email:', error)
  }
}
