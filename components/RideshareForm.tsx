'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'

export default function RideshareForm({ lang, translations }: { lang: string, translations: Record<string, string> }) {
  const [formData, setFormData] = useState({
    type: 'offer',
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to backend
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Use translations['form.fieldName'] for translations */}
    </form>
  )
}