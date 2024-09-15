'use client'

import React, { useState } from 'react'
import { FormData, RideOfferFormProps } from '../types'
import DriverVehicleInfoForm from './DriverVehicleInfoForm'
import RideDetailsForm from './RideDetailsForm'

export default function RideOfferForm({ translations, isLoggedIn, driverInfo, vehicleInfo }: RideOfferFormProps) {
  const [showDriverVehicleForm, setShowDriverVehicleForm] = useState(!isLoggedIn)
  const [formData, setFormData] = useState<FormData>({
    driverInfo: driverInfo || {
      name: '',
      phonenumber: '',
      email: '',
      licenseVerified: false,
      password: '',
    },
    vehicleInfo: vehicleInfo || {
      make: '',
      model: '',
      color: '',
      picture: null,
    },
    ridePreferences: {
      smoking: false,
      petFriendly: false,
      preferredPassengerGender: 'any',
      maxDetourDistance: 0,
    },
    rideDetails: {
      from: '',
      to: '',
      date: '',
      time: '',
      estimatedTravelTime: '',
      flexibleDeparture: false,
      seats: 1,
      price: '',
      routine: 'oneTime',
      notes: '',
    },
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

  const handleRideDetailsSubmit = async (rideDetails: FormData['rideDetails'], ridePreferences: FormData['ridePreferences']) => {
    const updatedFormData = {
      ...formData,
      rideDetails,
      ridePreferences
    }
    // TODO: Submit form data to backend
    console.log(updatedFormData)
  }

  if (showDriverVehicleForm) {
    return (
      <DriverVehicleInfoForm
        initialDriverInfo={formData.driverInfo}
        initialVehicleInfo={formData.vehicleInfo}
        onSubmit={handleDriverVehicleInfoSubmit}
        translations={translations}
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