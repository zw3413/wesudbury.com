import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import { DriverInfo, VehicleInfo } from '../types'

const commonVehicleColors = [
  'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Brown', 'Green', 
  'Beige', 'Orange', 'Gold', 'Yellow', 'Purple', 'Pink'
];

interface Props {
  initialDriverInfo: DriverInfo;
  initialVehicleInfo: VehicleInfo;
  onSubmit: (driverInfo: DriverInfo, vehicleInfo: VehicleInfo) => void;
  translations: {
    [key: string]: string;
  };
}

const carMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai'];
const carModels: { [key: string]: string[] } = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Prius'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
  Ford: ['F-150', 'Escape', 'Explorer', 'Mustang'],
  Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Traverse'],
  Nissan: ['Altima', 'Rogue', 'Sentra', 'Murano'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Audi: ['A4', 'A6', 'Q5', 'Q7'],
  Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe'],
};


export default function DriverVehicleInfoForm({ initialDriverInfo, initialVehicleInfo, onSubmit, translations }: Props) {
  const [driverInfo, setDriverInfo] = useState(initialDriverInfo)
  const [vehicleInfo, setVehicleInfo] = useState(initialVehicleInfo)
  const [emailError, setEmailError] = useState('')
  const [vehiclePicture, setVehiclePicture] = useState<File | null>(null)
  const [vehiclePicturePreview, setVehiclePicturePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if we have a saved email in localStorage
    const savedEmail = localStorage.getItem('driverEmail')
    if (savedEmail) {
      // If we have a saved email, fetch the driver's info from the API
      fetchDriverInfo(savedEmail)
    }
  }, [])

  const fetchDriverInfo = async (email: string) => {
    try {
      const response = await fetch(`/api/driver?email=${email}`)
      if (response.ok) {
        const data = await response.json()
        setDriverInfo(data.driver_info)
        setVehicleInfo(data.vehicle_info)
        //if the vehicle_info.pictureUrl is not null, set the vehiclePicturePreview to the vehicle_info.pictureUrl
        if (data.vehicle_info?.pictureUrl) {
          const vehiclePictureUrl = `/api/image-proxy?key=${encodeURIComponent(data.vehicle_info.pictureUrl)}`
          setVehiclePicturePreview(vehiclePictureUrl)
        }
        console.log(data)
      }
    } catch (error) {
      console.error('Error fetching driver info:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('driverInfo', JSON.stringify(driverInfo))
      formData.append('vehicleInfo', JSON.stringify(vehicleInfo))
      if (vehiclePicture) {
        formData.append('vehiclePicture', vehiclePicture)
      }

      const response = await fetch('/api/driver', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        localStorage.setItem('driverEmail', driverInfo.email)
        onSubmit(driverInfo, vehicleInfo)
      } else {
        throw new Error('Failed to save driver info')
      }
    } catch (error) {
      console.error('Error saving driver info:', error)
      alert('Failed to save driver information. Please try again.')
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith('driver')) {
      const field = name.replace('driver', '').toLowerCase()
      setDriverInfo(prev => ({
        ...prev,
        [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
      if (field === 'email') {
        if (!value.includes('@')) {
          setEmailError(translations['invalidEmail'] || 'Please enter a valid email address')
        } else {
          setEmailError('')
        }
        //check if the email is already in the database
        fetchDriverInfo(value)
        
      }
    } else if (name.startsWith('vehicle')) {
      const field = name.replace('vehicle', '').toLowerCase()
      setVehicleInfo(prev => {
        if (field === 'color') {
          if (value === 'other') {
            return { ...prev, color: value, colorOther: '' };
          } else {
            //eslint-disable-next-line
            const { colorOther, ...rest } = prev;
            return { ...rest, color: value };
          }
        }
        return { ...prev, [field]: value };
      })
    }
  }

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVehiclePicture(file)
      
      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onloadend = () => {
        setVehiclePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700 text-white"
  const selectClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700 text-white"
  const labelClassName = "block text-sm font-medium text-gray-200"

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Driver Information Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">{translations['driverInfo'] || 'Driver Information'}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="driverEmail" className={labelClassName}>* {translations['driverEmail'] || 'Email'}</label>
              <input
                type="email"
                id="driverEmail"
                name="driverEmail"
                value={driverInfo.email}
                onChange={handleChange}
                required
                className={`${inputClassName} ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="driverPhoneNumber" className="block text-sm font-medium text-gray-300">* {translations['driverPhoneNumber'] || 'Phone Number'}</label>
              <input
                type="tel"
                id="driverPhoneNumber"
                name="driverPhoneNumber"
                value={driverInfo.phonenumber}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-300">{translations['driverName'] || 'Name'}</label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={driverInfo.name}
                onChange={handleChange}

                className={inputClassName}
              />
            </div>
          </div>
        </section>

        {/* Vehicle Information Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">{translations['vehicleInfo'] || 'Vehicle Information'}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-300">{translations['make'] || 'Make'}</label>
              <select
                id="vehicleMake"
                name="vehicleMake"
                value={vehicleInfo.make}
                onChange={handleChange}
                
                className={selectClassName}
              >
                <option value="">{translations['selectMake'] || 'Select Make'}</option>
                {carMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-300">{translations['model'] || 'Model'}</label>
              <select
                id="vehicleModel"
                name="vehicleModel"
                value={vehicleInfo.model}
                onChange={handleChange}
                
                className={selectClassName}
              >
                <option value="">{translations['selectModel'] || 'Select Model'}</option>
                {vehicleInfo.make && carModels[vehicleInfo.make].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-300">{translations['color'] || 'Color'}</label>
              <select
                id="vehicleColor"
                name="vehicleColor"
                value={vehicleInfo.color}
                onChange={handleChange}
                
                className={selectClassName}
              >
                <option value="">{translations['selectColor'] || 'Select Color'}</option>
                {commonVehicleColors.map(color => (
                  <option key={color} value={color}>{translations[color.toLowerCase()] || color}</option>
                ))}
                <option value="other">{translations['otherColor'] || 'Other'}</option>
              </select>
            </div>
            {vehicleInfo.color === 'other' && (
              <div>
                <label htmlFor="vehicleColorOther" className="block text-sm font-medium text-gray-300">{translations['specifyColor'] || 'Specify Color'}</label>
                <input
                  type="text"
                  id="vehicleColorOther"
                  name="vehicleColorOther"
                  value={vehicleInfo.colorOther || ''}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            )}
            <div>
              <label htmlFor="vehiclePicture" className="block text-sm font-medium text-gray-300">{translations['vehiclePicture'] || 'Vehicle Picture'}</label>
              <input
                type="file"
                id="vehiclePicture"
                name="vehiclePicture"
                onChange={handlePictureChange}
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {translations['uploadPicture'] || 'Upload Picture'}
              </button>
              {vehiclePicture && <p className="mt-2 text-sm text-gray-300">{vehiclePicture.name}</p>}
              
              {/* Image preview */}
              {vehiclePicturePreview && (
                <div className="mt-4">
                  <Image
                    src={vehiclePicturePreview}
                    alt="Vehicle preview"
                    width={200}
                    height={150}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-3 px-6 rounded-full transition-colors">
          {translations['continue'] || 'Continue'}
        </button>
      </form>
    </div>
  )
}