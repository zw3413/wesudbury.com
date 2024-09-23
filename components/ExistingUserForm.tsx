import React, { useState } from 'react'

interface ExistingUserFormProps {
  email: string
  onSubmit: (email: string, password: string) => void
}

export default function ExistingUserForm({ email, onSubmit }: ExistingUserFormProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="pb-4">
      <h2 className="text-xl font-bold mb-4">Welcome Back</h2>
      <p className="mb-4">Please enter your password to continue.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Password"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  )
}