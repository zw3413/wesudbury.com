'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import BackButton from '@/components/BackButton';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Ride } from '@/types';

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
        // Here you would typically send the booking information to your backend
        // For this example, we'll just simulate a successful booking
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setIsBooked(true);
    };

    if (!rideDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton url={`/${lang}/rideshare/ride/${rideId}`} />
            <h1 className="text-3xl font-bold mb-6 text-center text-[rgb(40,76,96)]">{t('rideshare.bookRide')}</h1>

            {!isBooked ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('rideshare.passengerName')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={passengerInfo.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('rideshare.passengerEmail')}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={passengerInfo.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('rideshare.passengerPhone')}</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={passengerInfo.phone}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="w-full bg-[rgb(255,183,77)] hover:bg-[rgb(255,163,57)] text-[rgb(33,41,49)] font-bold py-2 px-4 rounded transition-colors">
                            {t('rideshare.bookNow')}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="max-w-md mx-auto text-center">
                    <p className="mb-4">{t('rideshare.bookingConfirmation')}</p>
                    <div className="flex justify-center space-x-4">
                        <a href={`tel:${rideDetails.driver_email}`} className="flex items-center justify-center px-4 py-2 bg-[rgb(40,76,96)] text-white rounded-lg">
                            <FaPhone className="mr-2" />
                            {t('rideshare.callDriver')}
                        </a>
                        <a href={`sms:${rideDetails.driver_email}`} className="flex items-center justify-center px-4 py-2 bg-[rgb(40,76,96)] text-white rounded-lg">
                            <FaEnvelope className="mr-2" />
                            {t('rideshare.textDriver')}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}