'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

type RideOfferFormProps = {
  translations: {
    [key: string]: string;
  };
}

export default function RideOfferForm({ translations }: RideOfferFormProps) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    vehicleType: '',
    seats: 1,
    price: '',
    routine: 'oneTime',
    frequency: '',
    notes: '',
  })

  const autocompleteFromRef = useRef<google.maps.places.Autocomplete | null>(null)
  const autocompleteToRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places']
    })

    loader.load().then(() => {
      const options = {
        componentRestrictions: { country: 'ca' },
        fields: ['address_components', 'geometry', 'name'],
        types: ['geocode']
      }

      const fromInput = document.getElementById('from') as HTMLInputElement
      const toInput = document.getElementById('to') as HTMLInputElement

      autocompleteFromRef.current = new google.maps.places.Autocomplete(fromInput, options)
      autocompleteToRef.current = new google.maps.places.Autocomplete(toInput, options)

      autocompleteFromRef.current.addListener('place_changed', () => handlePlaceSelect('from'))
      autocompleteToRef.current.addListener('place_changed', () => handlePlaceSelect('to'))
    })
  }, [])

  const handlePlaceSelect = (field: 'from' | 'to') => {
    const autocomplete = field === 'from' ? autocompleteFromRef.current : autocompleteToRef.current
    const place = autocomplete?.getPlace()

    if (place && place.name) {
      setFormData(prev => ({ ...prev, [field]: place.name }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to backend
    console.log(formData)
  }

  const commonLocations = [
    { name: 'Laurentian University', address: '935 Ramsey Lake Rd, Sudbury, ON P3E 2C6' },
    { name: 'Science North', address: '100 Ramsey Lake Rd, Sudbury, ON P3E 5S9' },
    { name: 'New Sudbury Centre', address: '1349 Lasalle Blvd, Sudbury, ON P3A 1Z2' },
  ]

  const setCommonLocation = (address: string, field: 'from' | 'to') => {
    setFormData(prev => ({ ...prev, [field]: address }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-[rgb(245,247,250)] p-8 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['from']}</label>
          <input type="text" id="from" name="from" value={formData.from} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
          <div className="mt-2 flex flex-wrap gap-2">
            {commonLocations.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCommonLocation(location.address, 'from')}
                className="text-xs bg-[rgb(255,183,77)] text-[rgb(33,41,49)] px-2 py-1 rounded"
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['to']}</label>
          <input type="text" id="to" name="to" value={formData.to} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
          <div className="mt-2 flex flex-wrap gap-2">
            {commonLocations.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCommonLocation(location.address, 'to')}
                className="text-xs bg-[rgb(255,183,77)] text-[rgb(33,41,49)] px-2 py-1 rounded"
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['date']}</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['time']}</label>
          <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
        </div>
      </div>

      <div>
        <label htmlFor="vehicleType" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['vehicleType']}</label>
        <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]">
          <option value="">{translations['selectVehicle']}</option>
          <option value="car">{translations['car']}</option>
          <option value="suv">{translations['suv']}</option>
          <option value="van">{translations['van']}</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="seats" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['seats']}</label>
          <input type="number" id="seats" name="seats" value={formData.seats} onChange={handleChange} min="1" max="8" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['price']}</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['routine']}</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input type="radio" name="routine" value="oneTime" checked={formData.routine === 'oneTime'} onChange={handleChange} className="form-radio text-[rgb(255,183,77)]" />
            <span className="ml-2 text-[rgb(33,41,49)]">{translations['oneTime']}</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="routine" value="recurring" checked={formData.routine === 'recurring'} onChange={handleChange} className="form-radio text-[rgb(255,183,77)]" />
            <span className="ml-2 text-[rgb(33,41,49)]">{translations['recurring']}</span>
          </label>
        </div>
      </div>

      {formData.routine === 'recurring' && (
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['frequency']}</label>
          <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]">
            <option value="">{translations['selectFrequency']}</option>
            <option value="daily">{translations['daily']}</option>
            <option value="weekly">{translations['weekly']}</option>
            <option value="weekdays">{translations['weekdays']}</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['notes']}</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]"></textarea>
      </div>

      <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full transition-colors">
        {translations['submit']}
      </button>
    </form>
  )
}