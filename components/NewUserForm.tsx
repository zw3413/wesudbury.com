import React, { useState, useEffect } from 'react'

interface NewUserFormProps {
  email: string
  onAgree: () => void
  onVerify: (email: string) => void
  onSetPassword: (password: string) => void
 
}

export default function NewUserForm({ email, onAgree, onVerify, onSetPassword }: NewUserFormProps) {
  const [agreed, setAgreed] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState(1)
  const [termsAndConditions, setTermsAndConditions] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState('')

  useEffect(() => {
    async function fetchTermsAndConditions() {
      try {
        const response = await fetch('/api/terms')
        if (response.ok) {
          const data = await response.json()
          setTermsAndConditions(data.content)
        } else {
          console.error('Failed to fetch terms and conditions')
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error)
      }
    }

    fetchTermsAndConditions()
  }, [])

  const handleAgree = () => {
    setAgreed(true)
    onAgree()
    handleSendVerification()
    setStep(2)
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setVerificationError('')
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verifyEmail', email, verificationCode }),
      })
      if (response.ok) {
        onVerify(email)
        setStep(3)
      } else {
        const data = await response.json()
        setVerificationError(data.error || 'Verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying email:', error)
      setVerificationError('An error occurred. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSendVerification = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendVerification', email }),
      })
      //alert('Verification code sent to your email.')
    } catch (error) {
      console.error('Error sending verification code:', error)
      //alert('Failed to send verification code. Please try again.')
    }
  }

  const handleSetPassword = () => {
    onSetPassword(password)
  }

  return (
    <div className="pb-4">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Welcome New User</h2>
          <p className="mb-4">Please read and agree to our terms and conditions.</p>
          <textarea 
            readOnly 
            className="w-full h-40 mb-4 p-2 border rounded" 
            value={termsAndConditions}
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mr-2"
            />
            I agree to the terms and conditions
          </label>
          <button
            onClick={handleAgree}
            disabled={!agreed}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
          >
            Continue
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
          <p className="mb-4">We&apos;ve sent a verification code to {email}. Please enter it below.</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Verification Code"
          />
          {verificationError && <p className="text-red-500 mb-2">{verificationError}</p>}
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={handleSendVerification}
            className="w-full bg-gray-300 text-gray-700 p-2 rounded"
          >
            Resend Verification Code
          </button>
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4">Set Your Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="New Password"
          />
          <button
            onClick={handleSetPassword}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Set Password
          </button>
        </>
      )}
    </div>
  )
}