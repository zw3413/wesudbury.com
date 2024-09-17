import React, { useState, useEffect, useRef } from 'react'
import { RideDetails, RidePreferences } from '../types'
import { Loader } from '@googlemaps/js-api-loader'
import { FaMapMarkerAlt } from 'react-icons/fa';
import CustomMultiSelect from './CustomMultiSelect';

type CityName = keyof typeof cityList;
const cityList = {
    'Sudbury': {
        center: { lat: 46.4917, lng: -80.9930 },
    },
    'Toronto': {
        center: { lat: 43.65107, lng: -79.347015 },
    },
    'Ottawa': {
        center: { lat: 45.4215, lng: -75.6979 },
    },
    "Thunder Bay": {
        center: { lat: 48.3799, lng: -89.2444 },
    },
    "Kingston": {
        center: { lat: 44.2324, lng: -76.4879 },
    },
    "London": {
        center: { lat: 42.9834, lng: -81.233 },
    },
    "Windsor": {
        center: { lat: 42.3001, lng: -83.018 },
    },
    "Sault Ste. Marie": {
        center: { lat: 46.519, lng: -84.348 },
    },
    "Barrie": {
        center: { lat: 44.3891, lng: -79.6917 },
    },
    "Niagara Falls": {
        center: { lat: 43.0963, lng: -79.0378 },
    },
    "St. Catharines": {
        center: { lat: 43.2203, lng: -79.1863 },
    },
    "Guelph": {
        center: { lat: 43.5448, lng: -80.2486 },
    },
    "Waterloo": {
        center: { lat: 43.4643, lng: -80.5204 },
    },
    "Cambridge": {
        center: { lat: 43.3601, lng: -80.3165 },
    },

}

interface Props {
    initialRideDetails: RideDetails;
    initialRidePreferences: RidePreferences;
    onSubmit: (rideDetails: RideDetails, ridePreferences: RidePreferences) => void;
    translations: {
        [key: string]: string;
    };
}

// const frequentlyUsedAddresses = [
//     "Laurentian University, Sudbury, ON",
//     "Science North, Sudbury, ON",
//     "New Sudbury Centre, Sudbury, ON",
//     "Health Sciences North, Sudbury, ON",
//     "Cambrian College, Sudbury, ON"
// ];

export default function RideDetailsForm({ initialRideDetails, initialRidePreferences, onSubmit, translations }: Props) {
    const [rideDetails, setRideDetails] = useState(initialRideDetails)
    const [ridePreferences, setRidePreferences] = useState(initialRidePreferences)
    const [showMap, setShowMap] = useState(false)
    const [currentField, setCurrentField] = useState<'from' | 'to' | null>(null)
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

    const mapRef = useRef<google.maps.Map | null>(null)
    const markerRef = useRef<google.maps.Marker | null>(null)
    const geocoderRef = useRef<google.maps.Geocoder | null>(null)

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            initializeAutocomplete('from')
            initializeAutocomplete('to')
            geocoderRef.current = new google.maps.Geocoder()
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
                    [field + '_address']: place.formatted_address || '',
                    [field + '_city']: place.address_components?.find(component => component.types.includes('locality'))?.long_name || '',
                    [field + '_coordinates']: place.geometry?.location ? {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    } : undefined,
                }))
            }
        })
    }

    const initializeMap = (field = "from" as 'from' | 'to') => {
        const mapElement = document.getElementById('map')

        // Default to the city of from|to _city
        const defaultCity = rideDetails[field + '_city' as keyof RideDetails] as CityName
        const center = cityList[defaultCity]?.center || { lat: 46.4917, lng: -80.9930 }

        if (mapElement && !mapRef.current) {
            // Try to get current location
            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(
            //         (position) => {
            //             center = {
            //                 lat: position.coords.latitude,
            //                 lng: position.coords.longitude
            //             };
            //             if (mapRef.current) {
            //                 mapRef.current.setCenter(center);
            //             }
            //         },
            //         () => {
            //             console.log('Unable to retrieve your location');
            //         }
            //     );
            // }

            mapRef.current = new google.maps.Map(mapElement, {
                center: center,
                zoom: 11,
            })

            mapRef.current.addListener('click', handleMapClick)
        }
    }

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng && mapRef.current && geocoderRef.current) {
            if (markerRef.current) {
                markerRef.current.setMap(null)
            }
            markerRef.current = new google.maps.Marker({
                position: event.latLng,
                map: mapRef.current,
            })

            geocoderRef.current.geocode({ location: event.latLng }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setSelectedAddress(results[0].formatted_address)
                }
            })
        }
    }

    const handleShowMap = (field: 'from' | 'to') => {
        setCurrentField(field)
        // wait for the current field to be set

            setShowMap(true)

            setSelectedAddress(null)

            // Reset the map and marker references
            mapRef.current = null
            if (markerRef.current) {
                markerRef.current.setMap(null)
                markerRef.current = null
            }

            // Use requestAnimationFrame to ensure the map div is rendered before initializing
            requestAnimationFrame(() => {
                initializeMap(field)
            })
  
    }

    const handleCloseMap = () => {
        setShowMap(false)
        if (markerRef.current) {
            markerRef.current.setMap(null)
        }
    }

    const handleConfirmLocation = () => {
        if (currentField && selectedAddress && geocoderRef.current) {
            geocoderRef.current.geocode({ address: selectedAddress }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const addressComponents = results[0].address_components;
                    const cityComponent = addressComponents.find(
                        component => component.types.includes('locality')
                    );
                    const city = cityComponent ? cityComponent.long_name : '';
    
                    setRideDetails(prev => ({
                        ...prev,
                        [currentField + '_address']: selectedAddress,
                        [currentField + '_city']: city,
                        [currentField + '_coordinates']: {
                            lat: markerRef.current?.getPosition()?.lat() ?? 0,
                            lng: markerRef.current?.getPosition()?.lng() ?? 0,
                        }
                    }));
                }
            });
        }
        handleCloseMap();
    };

    // const handleAddressSelect = (address: string, field: 'from' | 'to') => {
    //     setRideDetails(prev => ({ ...prev, [field]: address }))
    //     const input = document.getElementById(`${field}-input`) as HTMLInputElement
    //     input.value = address
    //     const autocomplete = field === 'from' ? fromAutocompleteRef.current : toAutocompleteRef.current
    //     if (autocomplete) {
    //         const geocoder = new google.maps.Geocoder()
    //         geocoder.geocode({ address }, (results, status) => {
    //             if (status === 'OK' && results && results[0]) {
    //                 const place = results[0]
    //                 autocomplete.set('place', place)
    //                 if (mapRef.current && place.geometry?.location) {
    //                     mapRef.current.setCenter(place.geometry.location)
    //                     new google.maps.Marker({
    //                         map: mapRef.current,
    //                         position: place.geometry.location,
    //                     })
    //                 }
    //             }
    //         })
    //     }
    // }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(rideDetails, ridePreferences)
    }

    const handleRideDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        console.log(e.target)
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

    const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700 text-white"
    const selectClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700 text-white"
    const checkboxClassName = "rounded border-gray-300 text-[rgb(255,183,77)] shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-offset-0 focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700"
    const labelClassName = "block text-sm font-medium text-gray-200"

    return (
        <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Ride Details Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-[rgb(255,183,77)]">{translations['rideDetails']}</h2>
                    <div className="space-y-4">
                        {['from', 'to'].map((field) => (
                            <div key={field}>
                                <div className="flex items-center justify-between">
                                    <label htmlFor={`${field}-input`} className={`${labelClassName} min-w-[100px] inline`}>
                                        * {translations[field]}
                                    </label>
                                    <select 
                                        className={`${selectClassName} px-2 text-center grow inline cursor-pointer`} 
                                        value={rideDetails[(field + "_city" as keyof RideDetails)] as string} 
                                        onChange={handleRideDetailsChange} 
                                        required 
                                        name={`${field}_city`}
                                    >
                                        {Object.keys(cityList).map((city) => (
                                            <option key={city} value={city}>{translations[city]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative mt-1">
                                    <input
                                        type="text"
                                        id={`${field}-input`}
                                        name={`${field}_address`}
                                        value={rideDetails[(field + "_address" as keyof RideDetails)] as string}
                                        onChange={handleRideDetailsChange}
                                        className={`${inputClassName} pr-10`}
                                        placeholder={`Enter ${field} address`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleShowMap(field as 'from' | 'to')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[rgb(255,183,77)] hover:text-[rgb(255,163,57)]"
                                    >
                                        <FaMapMarkerAlt size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div>
                            <label htmlFor="routine" className={labelClassName}>* {translations['routine']}</label>
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
                        {rideDetails.routine === 'recurring' ? (
                            <div>
                                <label htmlFor="daysOfWeek" className={labelClassName}>{translations['every']}</label>
                                <CustomMultiSelect
                                    options={[
                                        { value: 'Sunday', label: translations['Sunday'] },
                                        { value: 'Monday', label: translations['Monday'] },
                                        { value: 'Tuesday', label: translations['Tuesday'] },
                                        { value: 'Wednesday', label: translations['Wednesday'] },
                                        { value: 'Thursday', label: translations['Thursday'] },
                                        { value: 'Friday', label: translations['Friday'] },
                                        { value: 'Saturday', label: translations['Saturday'] },
                                    ]}
                                    selectedValues={rideDetails.daysOfWeek || []}
                                    onChange={(selected) => setRideDetails(prev => ({ ...prev, daysOfWeek: selected }))}
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="date" className={labelClassName}>* {translations['date']}</label>
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
                        )}
                        <div>
                            <label htmlFor="time" className={labelClassName}>* {translations['time']}</label>
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
                            <label htmlFor="estimatedTravelTime" className={labelClassName}>{translations['estimatedTravelTime']}</label>
                            <input
                                type="text"
                                id="estimatedTravelTime"
                                name="estimatedTravelTime"
                                value={rideDetails.estimatedTravelTime}
                                onChange={handleRideDetailsChange}
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="seats" className={labelClassName}>{translations['seats']}</label>
                            <input
                                type="number"
                                id="seats"
                                name="seats"
                                value={rideDetails.seats}
                                onChange={handleRideDetailsChange}
                                min="0"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className={labelClassName}>{translations['price']}</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={rideDetails.price}
                                onChange={handleRideDetailsChange}
                                className={inputClassName}
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className={labelClassName}>{translations['notes']}</label>
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
                            <label htmlFor="preferredPassengerGender" className={labelClassName}>{translations['preferredPassengerGender']}</label>
                            <select
                                id="preferredPassengerGender"
                                name="preferredPassengerGender"
                                value={ridePreferences.preferredPassengerGender}
                                onChange={handleRidePreferencesChange}
                                className={selectClassName}
                            >
                                <option value="any">{translations['genderAny']}</option>
                                <option value="male">{translations['genderMale']}</option>
                                <option value="female">{translations['genderFemale']}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="maxDetourDistance" className={labelClassName}>{translations['maxDetourDistance']}</label>
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

                <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-3 px-6 rounded-full transition-colors">
                    {translations['submit']}
                </button>
            </form>

            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-3xl">
                        <div id="map" style={{ height: '400px', width: '100%' }}></div>
                        {selectedAddress && (
                            <p className="mt-2 text-sm text-gray-300">Selected: {selectedAddress}</p>
                        )}
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleCloseMap}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLocation}
                                className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-2 px-4 rounded"
                                disabled={!selectedAddress}
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}