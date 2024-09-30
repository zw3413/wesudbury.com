'use client'

import React, { useState } from 'react'
import { FormData, RideOfferFormProps } from '../types'
import DriverVehicleInfoForm from './DriverVehicleInfoForm'
import RideDetailsForm from './RideDetailsForm'
import { RideDetails, RidePreferences, DriverInfo, VehicleInfo } from '../types'
import { useRouter } from 'next/navigation'



export default function RideOfferForm({ lang,translations, isLoggedIn, driverInfo, vehicleInfo }: RideOfferFormProps) {
  const router = useRouter()
  const [showDriverVehicleForm, setShowDriverVehicleForm] = useState(!isLoggedIn)
  const [formData, setFormData] = useState<FormData>({
    driverInfo: driverInfo || {
      name: '',
      phonenumber: '',
      email: '',
      licenseVerified: false,
      password: '',
    } as DriverInfo,
    vehicleInfo: vehicleInfo || {
      make: '',
      model: '',
      color: '',
      picture: null,
    } as VehicleInfo,
    ridePreferences: {
      smoking: false,
      petFriendly: false,
      preferredPassengerGender: 'any',
      maxDetourDistance: 10,
    } as RidePreferences,
    rideDetails: {
      from_city: 'Sudbury',
      to_city: 'Toronto',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date
      time: '08:00', // Set to 8:00 AM
      estimatedTravelTime: '',
      flexibleDeparture: false,
      seats: 3,
      price: '',
      routine: 'oneTime',
      notes: '',
    } as RideDetails,
  })

  const handleDriverVehicleInfoSubmit = (driverInfo: FormData['driverInfo'], vehicleInfo: FormData['vehicleInfo']) => {
    setFormData(prev => ({
      ...prev,
      driverInfo,
      vehicleInfo
    }))
    setShowDriverVehicleForm(false)
    // TODO: Save driver info to database or local storage
    console.log('Saving driver info:', driverInfo)
  }

  const handleRideDetailsSubmit = async (rideDetails: RideDetails, ridePreferences: RidePreferences) => {
    const driverEmail = localStorage.getItem('driverEmail')
    if (!driverEmail) {
      console.error('User email not found in localStorage')
      // You might want to handle this error, perhaps by redirecting to a login page
      return
    }

    const rideKey = `${driverEmail}_wesudbury_${rideDetails.date}_${rideDetails.time.replace(':', '')}`
    const driverInfo =  formData['driverInfo'] as DriverInfo
    const rideData = {
      key: rideKey,
      driver_email:driverEmail,
      driver_phonenumber:driverInfo.phonenumber,
      driver_name:driverInfo.name,
      ...rideDetails,
      ...ridePreferences,
      createdAt: new Date().toISOString(),
    }

    try {
      const response = await fetch('/api/ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rideData),
      })

      if (!response.ok) {
        throw new Error('Failed to save ride data')
      }

      const result = await response.json()
      console.log('Ride saved successfully:', result)

      // Navigate to the new ride details page
      const encodedKey = encodeURIComponent(rideData.key);
      router.push(`/${lang}/rideshare/ride/${encodedKey}`)
    } catch (error) {
      console.error('Error saving ride data:', error)
      // Handle the error, perhaps by showing an error message to the user
    }
  }

  if (showDriverVehicleForm) {
    return (
      <DriverVehicleInfoForm
        initialDriverInfo={formData.driverInfo}
        initialVehicleInfo={formData.vehicleInfo}
        onSubmit={handleDriverVehicleInfoSubmit}
        translations={translations}
        lang={lang}
      />
    )
  }

  return (
    <RideDetailsForm
      initialRideDetails={formData.rideDetails}
      initialRidePreferences={formData.ridePreferences}
      onSubmit={handleRideDetailsSubmit}
      translations={translations}
    />
  )
}