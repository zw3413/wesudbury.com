'use client'

import { useState } from 'react'

type RideshareFormProps = {
  translations: Record<string, string>;
}

export default function RideshareForm({ translations }: RideshareFormProps) {
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
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">{translations['form.type']}</label>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${formData.type === 'offer' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'offer' }))}
          >
            {translations['form.offer']}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${formData.type === 'request' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'request' }))}
          >
            {translations['form.request']}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="from" className="block text-gray-700 text-sm font-bold mb-2">{translations['form.from']}</label>
        <input type="text" name="from" value={formData.from} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      {/* Add other form fields here */}
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {translations['form.submit']}
      </button>
    </form>
  )
}