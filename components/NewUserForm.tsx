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
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    async function fetchTermsAndConditions() {
      try {
        const response = await fetch('/api/terms')
        if (response.ok) {
          const data = await response.json()
          setTermsAndConditions(data.content)
        } else {
          setGeneralError('Failed to fetch terms and conditions')
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error)
        setGeneralError('An error occurred while fetching terms and conditions')
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
    setGeneralError('')
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendVerification', email }),
      })
      if (!response.ok) {
        setGeneralError('Failed to send verification code. Please try again.')
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
      setGeneralError('An error occurred while sending the verification code')
    }
  }

  const handleSetPassword = () => {
    setPasswordError('')
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    onSetPassword(password)
  }

  return (
    <div className="pb-4 text-[rgb(33,41,49)]">
      {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-[rgb(40,76,96)]">Welcome New User</h2>
          <p className="mb-4">Please read and agree to our terms and conditions.</p>
          <textarea 
            readOnly 
            className="w-full h-40 mb-4 p-2 border rounded bg-[rgb(245,247,250)]" 
            value={termsAndConditions}
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mr-2 accent-[rgb(255,183,77)]"
            />
            I agree to the terms and conditions
          </label>
          <button
            onClick={handleAgree}
            disabled={!agreed}
            className="w-full bg-[rgb(40,76,96)] text-[rgb(250,252,255)] p-2 rounded disabled:bg-[rgb(245,247,250)] disabled:text-[rgb(33,41,49)]"
          >
            Continue
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-[rgb(40,76,96)]">Verify Your Email</h2>
          <p className="mb-4">We&apos;ve sent a verification code to {email}. Please enter it below.</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-[rgb(245,247,250)]"
            placeholder="Verification Code"
          />
          {verificationError && <p className="text-red-500 mb-2">{verificationError}</p>}
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-[rgb(40,76,96)] text-[rgb(250,252,255)] p-2 rounded mb-2 hover:bg-[rgb(60,96,116)]"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={handleSendVerification}
            className="w-full bg-[rgb(245,247,250)] text-[rgb(40,76,96)] p-2 rounded hover:bg-[rgb(235,237,240)]"
          >
            Resend Verification Code
          </button>
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-[rgb(40,76,96)]">Set Your Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-[rgb(245,247,250)]"
            placeholder="New Password"
          />
          {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
          <button
            onClick={handleSetPassword}
            className="w-full bg-[rgb(40,76,96)] text-[rgb(250,252,255)] p-2 rounded hover:bg-[rgb(60,96,116)]"
          >
            Set Password
          </button>
        </>
      )}
    </div>
  )
}