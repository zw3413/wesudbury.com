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

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)] bg-white"
  const selectClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)] bg-white"
  const checkboxClassName = "rounded border-gray-300 text-[rgb(54,89,108)] shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-offset-0 focus:ring-[rgb(255,183,77)] focus:ring-opacity-50"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-[rgb(250,252,255)] p-8 rounded-lg shadow-md">
      {/* Ride Details Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[rgb(54,89,108)]">{translations['rideDetails'] || 'Ride Details'}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">{translations['from'] || 'From'}</label>
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
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">{translations['to'] || 'To'}</label>
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">{translations['date'] || 'Date'}</label>
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
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">{translations['time'] || 'Time'}</label>
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
            <label htmlFor="estimatedTravelTime" className="block text-sm font-medium text-gray-700">{translations['estimatedTravelTime'] || 'Estimated Travel Time'}</label>
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
              <span className="ml-2 text-sm text-gray-700">{translations['flexibleDeparture'] || 'Flexible Departure Time'}</span>
            </label>
          </div>
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700">{translations['seats'] || 'Available Seats'}</label>
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{translations['price'] || 'Price per Seat'}</label>
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
            <label htmlFor="routine" className="block text-sm font-medium text-gray-700">{translations['routine'] || 'Ride Routine'}</label>
            <select
              id="routine"
              name="routine"
              value={rideDetails.routine}
              onChange={handleRideDetailsChange}
              required
              className={selectClassName}
            >
              <option value="oneTime">{translations['oneTime'] || 'One-time'}</option>
              <option value="recurring">{translations['recurring'] || 'Recurring'}</option>
            </select>
          </div>
          {rideDetails.routine === 'recurring' && (
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">{translations['frequency'] || 'Frequency'}</label>
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
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{translations['notes'] || 'Additional Notes'}</label>
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
        <h2 className="text-xl font-semibold mb-4 text-[rgb(54,89,108)]">{translations['ridePreferences'] || 'Ride Preferences'}</h2>
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
              <span className="ml-2 text-sm text-gray-700">{translations['smokingAllowed'] || 'Smoking Allowed'}</span>
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
              <span className="ml-2 text-sm text-gray-700">{translations['petFriendly'] || 'Pet Friendly'}</span>
            </label>
          </div>
          <div>
            <label htmlFor="preferredPassengerGender" className="block text-sm font-medium text-gray-700">{translations['preferredPassengerGender'] || 'Preferred Passenger Gender'}</label>
            <select
              id="preferredPassengerGender"
              name="preferredPassengerGender"
              value={ridePreferences.preferredPassengerGender}
              onChange={handleRidePreferencesChange}
              className={selectClassName}
            >
              <option value="any">{translations['any'] || 'Any'}</option>
              <option value="male">{translations['male'] || 'Male'}</option>
              <option value="female">{translations['female'] || 'Female'}</option>
            </select>
          </div>
          <div>
            <label htmlFor="maxDetourDistance" className="block text-sm font-medium text-gray-700">{translations['maxDetourDistance'] || 'Maximum Detour Distance (km)'}</label>
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
        {translations['submit'] || 'Submit'}
      </button>
    </form>
  )
}