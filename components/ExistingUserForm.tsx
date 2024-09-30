import React, { useState } from 'react'

interface ExistingUserFormProps {
  email: string
  onSubmit: (email: string, password: string) => void
}

export default function ExistingUserForm({ email, onSubmit }: ExistingUserFormProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      })

      if (response.ok) {
        onSubmit(email, password)
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid email or password. Please try again.')
        setPassword('')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setError('An error occurred while logging in. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 text-[rgb(33,41,49)]">
      <h2 className="text-xl font-bold mb-4 text-[rgb(40,76,96)]">Welcome Back</h2>
      <p className="mb-4">Please enter your password to continue.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-[rgb(245,247,250)]"
        placeholder="Password"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button 
        type="submit" 
        className="w-full bg-[rgb(40,76,96)] text-[rgb(250,252,255)] p-2 rounded hover:bg-[rgb(60,96,116)]"
      >
        Login
      </button>
    </form>
  )
}