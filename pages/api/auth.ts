import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Configure your email service here
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
    const { action, email, password, verificationCode, phonenumber, name } = req.body

    switch (action) {
      case 'sendVerification':
        await handleSendVerification(email, res)
        break
      case 'verifyEmail':
        await handleVerifyEmail(email, verificationCode, res)
        break
      case 'setPassword':
        await handleSetPassword(email, password, phonenumber, name,  res)
        break
      case 'login':
        await handleLogin(email, password, res)
        break
      default:
        res.status(400).json({ error: 'Invalid action' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function handleSendVerification(email: string, res: NextApiResponse) {
  const verificationCode = crypto.randomBytes(3).toString('hex')
  const { error } = await supabase
    .from('email_verifications')
    .upsert({ email, code: verificationCode, created_at: new Date().toISOString() })

  if (error) {
    return res.status(500).json({ error: 'Failed to save verification code' })
  }

  try {
    // Send email with verification code
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email for WeSudbury',
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <h1>Welcome to WeSudbury!</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>Please enter this code in the application to verify your email address.</p>
      `,
    })

    res.status(200).json({ message: 'Verification code sent' })
  } catch (error) {
    console.error('Error sending verification email:', error)
    res.status(500).json({ error: 'Failed to send verification email' })
  }
}

async function handleVerifyEmail(email: string, code: string, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('email_verifications')
    .select()
    .eq('email', email)
    .eq('code', code)
    .single()

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid verification code' })
  }

  // Mark email as verified in your users table
  await supabase
    .from('users')
    .update({ email_verified: true })
    .eq('email', email)

  res.status(200).json({ message: 'Email verified successfully' })
}

async function handleSetPassword(email: string, password:string, phonenumber:string, name: string, res: NextApiResponse) {
  const { error } = await supabase
    .from('users')
    .upsert({email:email, email_verified: true , password_hash: await hashPassword(password) , name:name, phone_number:phonenumber})
    .eq('email', email)

  if (error) {
    return res.status(500).json({ error: 'Failed to set password' })
  }

  res.status(200).json({ message: 'Password set successfully' })
}

async function handleLogin(email: string, password: string, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('users')
    .select('password_hash')
    .eq('email', email)
    .single()

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }

  const passwordMatch = await verifyPassword(password, data.password_hash)

  if (!passwordMatch) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }

  res.status(200).json({ message: 'Login successful' })
}

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(key === derivedKey.toString('hex'))
    })
  })
}