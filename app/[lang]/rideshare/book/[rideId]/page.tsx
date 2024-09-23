'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

import BackButton from '@/components/BackButton';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Ride } from '@/types';
import Modal from '@/components/Modal';
import NewUserForm from '@/components/NewUserForm';
import ExistingUserForm from '@/components/ExistingUserForm';

async function getRideDetails(rideId: string): Promise<Ride | null> {
    try {
        const response = await fetch(`/api/ride?key=${encodeURIComponent(rideId)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch ride details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ride details:', error);
        return null;
    }
}

export default function BookRidePage({ params: { lang, rideId } }: { params: { lang: string, rideId: string } }) {
    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
    const [passengerInfo, setPassengerInfo] = useState({ name: '', email: '', phone: '' });
    const [rideDetails, setRideDetails] = useState<Ride | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<'newUser' | 'existingUser'>('newUser');


    useEffect(() => {
        async function LoadData() {
            const { t } = await useTranslation(lang, 'common');
            setT(() => t);
            const details = await getRideDetails(rideId);
            setRideDetails(details);
        }
        LoadData();
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
                    phonenumber: passengerInfo.phone
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
            } else {
                throw new Error('Failed to book ride');
            }
        } catch (error) {
            console.error('Error booking ride:', error);
            alert('Failed to book the ride. Please try again.');
        }
    };

    if (!rideDetails) {
        return <div>Loading...</div>;
    }

    const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 bg-gray-700 text-white";
    const labelClassName = "block text-sm font-medium text-gray-200";

    return (
        <div className="min-h-screen bg-[rgb(250,252,255)] pt-8">
            <div className="container mx-auto px-4 py-8">
                <BackButton url={`/${lang}/rideshare/ride/${rideId}`} />
                <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-[rgba(40,76,96,1)] to-[rgba(40,76,96,0.6)]">
                    <h1 className="text-3xl font-bold mb-6 text-center text-[rgb(255,183,77)]">{t('rideshare.bookRide')}</h1>

                    {!isBooked ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <label htmlFor="phone" className={labelClassName}>{t('rideshare.passengerPhone')}</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={passengerInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                    className={inputClassName}
                                />
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
                            <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-gray-900 font-bold py-3 px-6 rounded-full transition-colors">
                                {t('rideshare.bookNow')}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center text-white">
                            <p className="mb-6">{t('rideshare.bookingConfirmation')}</p>
                            <div className="flex justify-center space-x-4">
                                <a href={`tel:${rideDetails.driver_email}`} className="flex items-center justify-center px-4 py-2 bg-[rgb(255,183,77)] text-gray-900 rounded-lg font-bold">
                                    <FaPhone className="mr-2" />
                                    {t('rideshare.callDriver')}
                                </a>
                                <a href={`sms:${rideDetails.driver_email}`} className="flex items-center justify-center px-4 py-2 bg-[rgb(255,183,77)] text-gray-900 rounded-lg font-bold">
                                    <FaEnvelope className="mr-2" />
                                    {t('rideshare.textDriver')}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                {modalContent === 'newUser' ? (
                    <NewUserForm
                        email={passengerInfo.email}
                        onAgree={() => {}}
                        onVerify={async (email) => {
                            // You can implement email verification here if needed
                            console.log('Verifying email:', email);
                        }}
                        onSetPassword={handleNewUserSubmit}
                    />
                ) : (
                    <ExistingUserForm
                        email={passengerInfo.email}
                        onSubmit={handleExistingUserSubmit}
                    />
                )}
            </Modal>
        </div>
    );
}