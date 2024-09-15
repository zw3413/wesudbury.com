'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function RideshareForm({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'rideshare')
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
        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">{t('form.type')}</label>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${formData.type === 'offer' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'offer' }))}
          >
            {t('form.offer')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${formData.type === 'request' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'request' }))}
          >
            {t('form.request')}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="from" className="block text-gray-700 text-sm font-bold mb-2">{t('form.from')}</label>
        <input type="text" name="from" value={formData.from} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div className="mb-4">
        <label htmlFor="to" className="block text-gray-700 text-sm font-bold mb-2">{t('form.to')}</label>
        <input type="text" name="to" value={formData.to} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">{t('form.date')}</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="w-1/2 pl-2">
          <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">{t('form.time')}</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
      </div>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="seats" className="block text-gray-700 text-sm font-bold mb-2">{t('form.seats')}</label>
          <input type="number" name="seats" value={formData.seats} onChange={handleChange} min="1" max="8" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="w-1/2 pl-2">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">{t('form.price')}</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">{t('form.description')}</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" />
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {t('form.submit')}
      </button>
    </form>
  )
}