import React, { useState, useEffect, useRef } from 'react'
import { RideDetails, RidePreferences } from '../types'
import { Loader } from '@googlemaps/js-api-loader'

interface Props {
  initialRideDetails: RideDetails;
  initialRidePreferences: RidePreferences;
  onSubmit: (rideDetails: RideDetails, ridePreferences: RidePreferences) => void;
  translations: {
    [key: string]: string;
  };
}

const frequentlyUsedAddresses = [
  "Laurentian University, Sudbury, ON",
  "Science North, Sudbury, ON",
  "New Sudbury Centre, Sudbury, ON",
  "Health Sciences North, Sudbury, ON",
  "Cambrian College, Sudbury, ON"
];

export default function RideDetailsForm({ initialRideDetails, initialRidePreferences, onSubmit, translations }: Props) {
  const [rideDetails, setRideDetails] = useState(initialRideDetails)
  const [ridePreferences, setRidePreferences] = useState(initialRidePreferences)
  const [showMap, setShowMap] = useState(false)
  const [currentField, setCurrentField] = useState<'from' | 'to' | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      initializeAutocomplete('from')
      initializeAutocomplete('to')
      initializeMap()
    });
  }, []);

  const initializeAutocomplete = (field: 'from' | 'to') => {
    const input = document.getElementById(`${field}-input`) as HTMLInputElement
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' },
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        setRideDetails(prev => ({
          ...prev,
          [field]: place.formatted_address || '',
        }))
      }
    })

    if (field === 'from') fromAutocompleteRef.current = autocomplete
    else toAutocompleteRef.current = autocomplete
  }

  const initializeMap = () => {
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapRef.current = new google.maps.Map(mapElement, {
        center: { lat: 46.4917, lng: -80.9930 }, // Sudbury coordinates
        zoom: 12,
      })
    }
  }

  const handleAddressSelect = (address: string, field: 'from' | 'to') => {
    setRideDetails(prev => ({ ...prev, [field]: address }))
    const input = document.getElementById(`${field}-input`) as HTMLInputElement
    input.value = address
    const autocomplete = field === 'from' ? fromAutocompleteRef.current : toAutocompleteRef.current
    if (autocomplete) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const place = results[0]
          autocomplete.set('place', place)
          if (mapRef.current && place.geometry?.location) {
            mapRef.current.setCenter(place.geometry.location)
            new google.maps.Marker({
              map: mapRef.current,
              position: place.geometry.location,
            })
          }
        }
      })
    }
  }

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng && currentField) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setRideDetails(prev => ({ ...prev, [currentField]: results[0].formatted_address }))
          const input = document.getElementById(`${currentField}-input`) as HTMLInputElement
          input.value = results[0].formatted_address || ''
        }
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(rideDetails, ridePreferences)
  }

  const handleRideDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setRideDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleRidePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setRidePreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const inputClassName = "mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50"
  const selectClassName = "mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50"
  const checkboxClassName = "rounded border-gray-600 text-[rgb(255,183,77)] bg-gray-700 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-offset-0 focus:ring-[rgb(255,183,77)] focus:ring-opacity-50"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-[rgb(54,89,108)] p-8 rounded-lg shadow-md">
      {/* Ride Details Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">{translations['rideDetails']}</h2>
        <div className="space-y-4">
          {['from', 'to'].map((field) => (
            <div key={field}>
              <label htmlFor={`${field}-input`} className="block text-sm font-medium text-gray-200">
                {translations[field]}
              </label>
              <input
                type="text"
                id={`${field}-input`}
                name={field}
                value={rideDetails[field as 'from' | 'to']}
                onChange={handleRideDetailsChange}
                required
                className={inputClassName}
                placeholder={`Enter ${field} address`}
                onFocus={() => setCurrentField(field as 'from' | 'to')}
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="text-sm text-[rgb(255,183,77)] hover:text-[rgb(255,163,57)]"
                >
                  Select on map
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-300 mb-1">Frequently used:</p>
                <div className="flex flex-wrap gap-2">
                  {frequentlyUsedAddresses.map((address) => (
                    <button
                      key={address}
                      type="button"
                      onClick={() => handleAddressSelect(address, field as 'from' | 'to')}
                      className="text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      {address}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-200">{translations['date']}</label>
            <input
              type="date"
              id="date"
              name="date"
              value={rideDetails.date}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-200">{translations['time']}</label>
            <input
              type="time"
              id="time"
              name="time"
              value={rideDetails.time}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="estimatedTravelTime" className="block text-sm font-medium text-gray-200">{translations['estimatedTravelTime']}</label>
            <input
              type="text"
              id="estimatedTravelTime"
              name="estimatedTravelTime"
              value={rideDetails.estimatedTravelTime}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="flexibleDeparture"
                checked={rideDetails.flexibleDeparture}
                onChange={handleRideDetailsChange}
                className={checkboxClassName}
              />
              <span className="ml-2 text-sm text-gray-200">{translations['flexibleDeparture']}</span>
            </label>
          </div>
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-200">{translations['seats']}</label>
            <input
              type="number"
              id="seats"
              name="seats"
              value={rideDetails.seats}
              onChange={handleRideDetailsChange}
              required
              min="1"
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-200">{translations['price']}</label>
            <input
              type="text"
              id="price"
              name="price"
              value={rideDetails.price}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="routine" className="block text-sm font-medium text-gray-200">{translations['routine']}</label>
            <select
              id="routine"
              name="routine"
              value={rideDetails.routine}
              onChange={handleRideDetailsChange}
              required
              className={selectClassName}
            >
              <option value="oneTime">{translations['oneTime']}</option>
              <option value="recurring">{translations['recurring']}</option>
            </select>
          </div>
          {rideDetails.routine === 'recurring' && (
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-200">{translations['frequency']}</label>
              <input
                type="text"
                id="frequency"
                name="frequency"
                value={rideDetails.frequency || ''}
                onChange={handleRideDetailsChange}
                className={inputClassName}
              />
            </div>
          )}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-200">{translations['notes']}</label>
            <textarea
              id="notes"
              name="notes"
              value={rideDetails.notes}
              onChange={handleRideDetailsChange}
              className={inputClassName}
              rows={3}
            ></textarea>
          </div>
        </div>
      </section>

      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-3xl">
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="mt-4 bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* Ride Preferences Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">{translations['ridePreferences']}</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="smoking"
                checked={ridePreferences.smoking}
                onChange={handleRidePreferencesChange}
                className={checkboxClassName}
              />
              <span className="ml-2 text-sm text-gray-200">{translations['smokingAllowed']}</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="petFriendly"
                checked={ridePreferences.petFriendly}
                onChange={handleRidePreferencesChange}
                className={checkboxClassName}
              />
              <span className="ml-2 text-sm text-gray-200">{translations['petFriendly']}</span>
            </label>
          </div>
          <div>
            <label htmlFor="preferredPassengerGender" className="block text-sm font-medium text-gray-200">{translations['preferredPassengerGender']}</label>
            <select
              id="preferredPassengerGender"
              name="preferredPassengerGender"
              value={ridePreferences.preferredPassengerGender}
              onChange={handleRidePreferencesChange}
              className={selectClassName}
            >
              <option value="any">{translations['any']}</option>
              <option value="male">{translations['male']}</option>
              <option value="female">{translations['female']}</option>
            </select>
          </div>
          <div>
            <label htmlFor="maxDetourDistance" className="block text-sm font-medium text-gray-200">{translations['maxDetourDistance']}</label>
            <input
              type="number"
              id="maxDetourDistance"
              name="maxDetourDistance"
              value={ridePreferences.maxDetourDistance}
              onChange={handleRidePreferencesChange}
              min="0"
              step="0.1"
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full transition-colors">
        {translations['submit']}
      </button>
    </form>
  )
}