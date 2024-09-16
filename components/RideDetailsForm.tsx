import React, { useState } from 'react'
import { RideDetails, RidePreferences } from '../types'

interface Props {
  initialRideDetails: RideDetails;
  initialRidePreferences: RidePreferences;
  onSubmit: (rideDetails: RideDetails, ridePreferences: RidePreferences) => void;
  translations: {
    [key: string]: string;
  };
}

export default function RideDetailsForm({ initialRideDetails, initialRidePreferences, onSubmit, translations }: Props) {
  const [rideDetails, setRideDetails] = useState(initialRideDetails)
  const [ridePreferences, setRidePreferences] = useState(initialRidePreferences)

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
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-200">{translations['from']}</label>
            <input
              type="text"
              id="from"
              name="from"
              value={rideDetails.from}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-200">{translations['to']}</label>
            <input
              type="text"
              id="to"
              name="to"
              value={rideDetails.to}
              onChange={handleRideDetailsChange}
              required
              className={inputClassName}
            />
          </div>
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