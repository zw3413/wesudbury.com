import React, { useState } from 'react'

import { DriverInfo, VehicleInfo } from '../types'

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
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (driverInfo.password !== confirmPassword) {
      alert(translations['passwordMismatch'] || 'Passwords do not match')
      return
    }
    onSubmit(driverInfo, vehicleInfo)
    // TODO: Save driver's info to database
    console.log('Saving driver info to database:', driverInfo)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target)
    const { name, value, type } = e.target
    if (name.startsWith('driver')) {
      const field = name.replace('driver', '').toLowerCase()
      setDriverInfo(prev => ({
        ...prev,
        [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    } else if (name.startsWith('vehicle')) {
        console.log(name)
        console.log(value)
      const field = name.replace('vehicle', '').toLowerCase()
      console.log('field', field)
      console.log('value', value)
      setVehicleInfo(prev => ({ ...prev, [field]: value }))
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVehicleInfo(prev => ({ ...prev, picture: file }))
    }
  }

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)] bg-white"
  const selectClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 text-[rgb(33,41,49)] bg-white"
  const checkboxClassName = "rounded border-gray-300 text-[rgb(54,89,108)] shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-offset-0 focus:ring-[rgb(255,183,77)] focus:ring-opacity-50"
  const fileInputClassName = "mt-1 block w-full text-sm text-[rgb(33,41,49)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgb(245,247,250)] file:text-[rgb(54,89,108)] hover:file:bg-[rgb(255,183,77)] hover:file:text-[rgb(33,41,49)]"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-[rgb(250,252,255)] p-8 rounded-lg shadow-md">
      {/* Driver Information Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[rgb(54,89,108)]">{translations['driverInfo'] || 'Driver Information'}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">{translations['driverName'] || 'Name'}</label>
            <input
              type="text"
              id="driverName"
              name="driverName"
              value={driverInfo.name}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="driverPhoneNumber" className="block text-sm font-medium text-gray-700">{translations['driverPhoneNumber'] || 'Phone Number'}</label>
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
            <label htmlFor="driverEmail" className="block text-sm font-medium text-gray-700">{translations['driverEmail'] || 'Email'}</label>
            <input
              type="email"
              id="driverEmail"
              name="driverEmail"
              value={driverInfo.email}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="driverPassword" className="block text-sm font-medium text-gray-700">{translations['driverPassword'] || 'Password'}</label>
            <input
              type="password"
              id="driverPassword"
              name="driverPassword"
              value={driverInfo.password}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{translations['confirmPassword'] || 'Confirm Password'}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">{translations['driverLicense'] || 'Driver License'}</label>
            <input
              type="file"
              id="driverLicense"
              name="driverLicense"
              onChange={handleFileChange}
              className={fileInputClassName}
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="driverLicenseVerified"
                checked={driverInfo.licenseVerified}
                onChange={handleChange}
                className={checkboxClassName}
              />
              <span className="ml-2 text-sm text-gray-700">{translations['licenseVerified'] || 'License Verified'}</span>
            </label>
          </div>
        </div>
      </section>

      {/* Vehicle Information Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[rgb(54,89,108)]">{translations['vehicleInfo'] || 'Vehicle Information'}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">{translations['vehicleMake'] || 'Make'}</label>
            <select
              id="vehicleMake"
              name="vehicleMake"
              value={vehicleInfo.make}
              onChange={handleChange}
              required
              className={selectClassName}
            >
              <option value="">{translations['selectMake'] || 'Select Make'}</option>
              {carMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">{translations['vehicleModel'] || 'Model'}</label>
            <select
              id="vehicleModel"
              name="vehicleModel"
              value={vehicleInfo.model}
              onChange={handleChange}
              required
              className={selectClassName}
            >
              <option value="">{translations['selectModel'] || 'Select Model'}</option>
              {vehicleInfo.make && carModels[vehicleInfo.make].map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-700">{translations['vehicleColor'] || 'Color'}</label>
            <input
              type="text"
              id="vehicleColor"
              name="vehicleColor"
              value={vehicleInfo.color}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="vehiclePicture" className="block text-sm font-medium text-gray-700">{translations['vehiclePicture'] || 'Vehicle Picture'}</label>
            <input
              type="file"
              id="vehiclePicture"
              name="vehiclePicture"
              onChange={handleFileChange}
              accept="image/*"
              className={fileInputClassName}
            />
          </div>
        </div>
      </section>

      <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-3 px-6 rounded-full transition-colors">
        {translations['continue'] || 'Continue'}
      </button>
    </form>
  )
}