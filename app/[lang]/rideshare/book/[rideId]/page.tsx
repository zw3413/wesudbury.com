'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import BackButton from '@/components/BackButton';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Ride } from '@/types';
import Modal from '@/components/Modal';
import NewUserForm from '@/components/NewUserForm';
import ExistingUserForm from '@/components/ExistingUserForm';
import { Loader } from '@googlemaps/js-api-loader';

async function getRideDetails(rideId: string): Promise<Ride | null> {
    try {
        const response = await fetch(`/api/ride?key=${encodeURIComponent(rideId)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch ride details');
        }
        const data = await response.json();
        return data.rideinfo;
    } catch (error) {
        console.error('Error fetching ride details:', error);
        return null;
    }
}

export default function BookRidePage({ params: { lang, rideId } }: { params: { lang: string, rideId: string } }) {
    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
    const [passengerInfo, setPassengerInfo] = useState({ name: '', email: '', phone_number: '', from_address: '', to_address: '', from_coordinates: '', to_coordinates: '' });
    const [rideDetails, setRideDetails] = useState<Ride | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<'newUser' | 'existingUser' | 'map'>('newUser');
    const [currentAddressField, setCurrentAddressField] = useState<'from' | 'to'>('from');
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    const fetchPassengerInfoFromUsers = async (email: string) => {
        const encodedKey = encodeURIComponent(email)
        try {
            const response = await fetch(`/api/user?email=${encodedKey}`)
            if (response.ok) {
                const user = await response.json()
                if (user.email) {
                    setPassengerInfo(user)
                }
            }
        } catch (error) {
            console.error('Error fetching passenger info:', error)
        }
    }

    useEffect(() => {
        const passengerEmail = localStorage.getItem('passengerEmail')
        if (passengerEmail) {
            fetchPassengerInfoFromUsers(passengerEmail)
        }
        async function LoadData() {
            const { t } = await useTranslation(lang, 'common');
            setT(() => t);
            const details = await getRideDetails(rideId);
            setRideDetails(details);
        }
        LoadData();

        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            geocoderRef.current = new google.maps.Geocoder();
        });
    }, [lang, rideId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassengerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Check if the email exists in the users table
            const checkResponse = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'checkEmail', email: passengerInfo.email }),
            });

            if (checkResponse.status === 404) {
                // If not, show the NewUserForm modal
                setModalContent('newUser');
                setShowModal(true);
            } else if (checkResponse.ok) {
                // Email exists, show the ExistingUserForm modal
                setModalContent('existingUser');
                setShowModal(true);
            } else {
                throw new Error('Failed to check email');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleNewUserSubmit = async (password: string) => {
        try {
            // Set password for new user
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'setPassword',
                    email: passengerInfo.email,
                    password,
                    name: passengerInfo.name,
                    phonenumber: passengerInfo.phone_number
                }),
            });

            setShowModal(false);
            await bookRide();
        } catch (error) {
            console.error('Error setting password:', error);
            alert('An error occurred while setting your password. Please try again.');
        }
    };

    const handleExistingUserSubmit = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password }),
            });

            if (response.ok) {
                setShowModal(false);
                await bookRide();
            } else {
                alert('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again.');
        }
    };

    const bookRide = async () => {
        try {
            // Save the booking information
            const bookResponse = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rideId,
                    passengerInfo
                }),
            });

            if (bookResponse.ok) {
                setIsBooked(true);
                localStorage.setItem('passengerEmail', passengerInfo.email)

                if (rideDetails) {
                    // Send email to driver to inform them to confirm the booking
                    const notifyDriverResponse = await fetch('/api/notify-driver', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            rideId,
                            driverEmail: rideDetails.driver_email,
                            passengerName: passengerInfo.name,
                            passengerEmail: passengerInfo.email,
                            passengerPhone: passengerInfo.phone_number,
                            fromCoordinate: JSON.stringify({lat:0,lng:0}),
                            toCoordinate: JSON.stringify({lat:0,lng:0}),
                        }),
                    });
                    if (!notifyDriverResponse.ok) {
                        alert('Failed to send notification to driver, please contact the driver by yourself.');
                    }
                } else {
                    alert("book failed, please try again later.")
                }



            } else {
                throw new Error('Failed to book ride');
            }
        } catch (error) {
            console.error('Error booking ride:', error);
            alert('Failed to book the ride. Please try again.');
        }
    };

    const handleShowMap = (field: 'from' | 'to') => {
        setCurrentAddressField(field);
        setModalContent('map');
        setShowModal(true);
        setSelectedAddress(null);

        // Reset the map and marker references
        mapRef.current = null;
        if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
        }

        // Use requestAnimationFrame to ensure the map div is rendered before initializing
        requestAnimationFrame(() => {
            initializeMap();
        });
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    if (mapRef.current) {
                        mapRef.current.setCenter(pos);
                        if (markerRef.current) {
                            markerRef.current.setMap(null);
                        }
                        markerRef.current = new google.maps.Marker({
                            position: pos,
                            map: mapRef.current,
                            title: "Your location"
                        });
                    }
                    if(geocoderRef.current){
                        geocoderRef.current.geocode({ location: pos }, (results, status) => {
                            if (status === 'OK' && results && results[0]) {
                                setSelectedAddress(results[0].formatted_address);
                            }
                        });
                    }
                },
                (error) => {
                    console.error("Error: The Geolocation service failed.", error);
                    alert(t('geolocationFailed') || "Unable to get your location. Please check your device settings and try again.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            alert(t('geolocationNotSupported') || "Your browser doesn't support geolocation.");
        }
    };

    const initializeMap = () => {
        const mapElement = document.getElementById('map');
        if (mapElement && !mapRef.current) {
            const defaultCenter = { lat: 46.4917, lng: -80.9930 }; // Default to Sudbury
            mapRef.current = new google.maps.Map(mapElement, {
                center: defaultCenter,
                zoom: 12,
                gestureHandling: 'greedy',
                streetViewControl: false,
            });

            // Add custom geolocation control
            const locationButton = document.createElement("button");
            locationButton.textContent = "📍"; // Using an emoji instead of Font Awesome icon
            locationButton.classList.add("custom-map-control-button");
            locationButton.style.cssText = `
                background-color: #fff;
                border: none;
                outline: none;
                width: 40px;
                height: 40px;
                border-radius: 2px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                cursor: pointer;
                margin-right: 10px;
                padding: 0;
                font-size: 18px;
            `;

            mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
            locationButton.addEventListener("click", handleGeolocation);

            mapRef.current.addListener('click', handleMapClick);
        }
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng && mapRef.current && geocoderRef.current) {
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            markerRef.current = new google.maps.Marker({
                position: event.latLng,
                map: mapRef.current,
            });

            geocoderRef.current.geocode({ location: event.latLng }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setSelectedAddress(results[0].formatted_address);
                }
            });
        }
    };

    const handleConfirmLocation = () => {
        if (selectedAddress && markerRef.current) {
            const coordinates = `${markerRef.current.getPosition()?.lat()},${markerRef.current.getPosition()?.lng()}`;
            setPassengerInfo(prev => ({
                ...prev,
                [`${currentAddressField}_address`]: selectedAddress,
                [`${currentAddressField}_coordinates`]: coordinates
            }));
        }
        setShowModal(false);
    };

    // Add this new component for displaying ride info
    const RideInfoDisplay = ({ ride }: { ride: Ride | null }) => {
        if (!ride) return null;
        return (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('rideshare.rideDetails')}</h2>
                <div className="grid grid-cols-1">
                    <div>
                        <p><strong>{t('rideshare.form.from')}:</strong> {ride.from_city}</p>
                        <p><strong>{t('rideshare.form.to')}:</strong> {ride.to_city}</p>
                        <p><strong>{t('rideshare.form.date')}:</strong> {ride.date}</p>
                        <p><strong>{t('rideshare.form.time')}:</strong> {ride.time}</p>
                        <p><strong>{t('rideshare.form.seats')}:</strong> {ride.seats}</p>
                        <p><strong>{t('rideshare.form.price')}:</strong> {ride.price}</p>
                        <p><strong>{t('rideshare.driverName')}:</strong> {ride.driver_name}</p>
                    </div>

                </div>
            </div>
        );
    };

    if (!rideDetails) {
        return <div>Loading...</div>;
    }

    const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#FFB74D] focus:ring focus:ring-[#FFB74D] focus:ring-opacity-50 bg-white text-gray-900";
    const labelClassName = "block text-sm font-medium text-gray-700";

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <BackButton url={`/${lang}/rideshare/ride/${rideId}`} />
                <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">{t('rideshare.bookRide')}</h1>

                        {/* Add the RideInfoDisplay component here */}
                        <RideInfoDisplay ride={rideDetails} />

                        {!isBooked ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                                    {/* show the ride info on the top of the booking form */}



                                    <div>
                                        <label htmlFor="name" className={labelClassName}>{t('rideshare.passengerName')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={passengerInfo.name}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClassName}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone_number" className={labelClassName}>{t('rideshare.passengerPhone')}</label>
                                        <input
                                            type="tel"
                                            id="phone_number"
                                            name="phone_number"
                                            value={passengerInfo.phone_number}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClassName}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClassName}>{t('rideshare.passengerEmail')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={passengerInfo.email}
                                        onChange={handleInputChange}
                                        required
                                        className={inputClassName}
                                    />
                                </div>

                                {['from', 'to'].map((field) => (
                                    <div key={field}>
                                        <label htmlFor={`${field}_address`} className={labelClassName}>
                                            {t(`rideshare.${field}Address`)}
                                        </label>
                                        <div className="relative mt-1">
                                            <input
                                                type="text"
                                                id={`${field}_address`}
                                                name={`${field}_address`}
                                                value={passengerInfo[`${field}_address` as keyof typeof passengerInfo]}
                                                onChange={handleInputChange}
                                                className={`${inputClassName} pr-10`}
                                                placeholder={t('rideshare.selectAddress')}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleShowMap(field as 'from' | 'to')}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <FaMapMarkerAlt size={20} />
                                            </button>
                                        </div>
                                        <input
                                            type="hidden"
                                            name={`${field}_coordinates`}
                                            value={passengerInfo[`${field}_coordinates` as keyof typeof passengerInfo]}
                                        />
                                    </div>
                                ))}

                                <div className="mt-8">
                                    <button type="submit" className="w-full bg-[#FFB74D] hover:bg-[#FFA726] text-white font-bold py-3 px-6 rounded-md transition-colors duration-200">
                                        {t('rideshare.bookNow')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center">
                                <p className="mb-6 text-lg text-gray-700">{t('rideshare.bookingConfirmation')}</p>
                                <div className="flex justify-center space-x-4">
                                    <a href={`tel:${rideDetails.driver_phonenumber}`} className="flex items-center justify-center px-4 py-2 bg-[#FFB74D] text-white rounded-md font-bold hover:bg-[#FFA726] transition-colors duration-200">
                                        <FaPhone className="mr-2" />
                                        {t('rideshare.callDriver')}
                                    </a>
                                    <a href={`sms:${rideDetails.driver_phonenumber}`} className="flex items-center justify-center px-4 py-2 bg-[#FFB74D] text-white rounded-md font-bold hover:bg-[#FFA726] transition-colors duration-200">
                                        <FaEnvelope className="mr-2" />
                                        {t('rideshare.textDriver')}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                {modalContent === 'newUser' && (
                    <NewUserForm
                        email={passengerInfo.email}
                        onAgree={() => { }}
                        onVerify={async (email) => {
                            console.log('Verifying email:', email);
                        }}
                        onSetPassword={handleNewUserSubmit}
                    />
                )}
                {modalContent === 'existingUser' && (
                    <ExistingUserForm
                        email={passengerInfo.email}
                        onSubmit={handleExistingUserSubmit}
                    />
                )}
                {modalContent === 'map' && (
                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-3xl">
                        <div id="map" style={{ height: '400px', width: '100%' }}></div>
                        {selectedAddress && (
                            <p className="mt-2 text-sm text-gray-300">Selected: {selectedAddress}</p>
                        )}
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {t('cancel') || "Cancel"}
                            </button>
                            {/* <button
                                type="button"
                                onClick={handleGeolocation}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <FaLocationArrow className="mr-2" />
                                {t('useCurrentLocation') || "Use Current Location"}
                            </button> */}
                            <button
                                type="button"
                                onClick={handleConfirmLocation}
                                className="bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-2 px-4 rounded"
                                disabled={!selectedAddress}
                            >
                                {t('confirmLocation') || "Confirm Location"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}