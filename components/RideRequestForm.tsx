'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

type RideRequestFormProps = {
    translations: {
        [key: string]: string;
    };
}

export default function RideRequestForm({ translations }: RideRequestFormProps) {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: 1,
        maxPrice: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Submit form data to backend
        console.log(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-[rgb(245,247,250)] p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['from']}</label>
                    <input type="text" id="from" name="from" value={formData.from} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
                </div>
                <div>
                    <label htmlFor="to" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['to']}</label>
                    <input type="text" id="to" name="to" value={formData.to} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
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

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="seats" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['seats']}</label>
                    <input type="number" id="seats" name="seats" value={formData.seats} onChange={handleChange} min="1" max="8" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
                </div>
                <div>
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-[rgb(54,89,108)]">{translations['maxPrice']}</label>
                    <input type="number" id="maxPrice" name="maxPrice" value={formData.maxPrice} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)]" />
                </div>
            </div>

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