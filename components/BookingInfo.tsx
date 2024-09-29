'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Modal from '@/components/Modal'; // Make sure you have this Modal component
import { BookingType } from '@/types';


interface BookingInfoProps {
    rideId: string
    driverEmail: string
    lang: string
    rideDetails: { [key: string]: unknown }
}

// "status1": "Pending Confirmation from Driver",
// "status2": "Confirmed By Driver",
// "status3": "Rejected By Driver",
// "status4": "Cancelled By Passenger"
// { [key: string]: string };
const BookingStatus: { [key: string]: string } = {
    "1": "rideshare.bookings.status1",
    "2": "rideshare.bookings.status2",
    "3": "rideshare.bookings.status3",
    "4": "rideshare.bookings.status4"
}

export default function BookingInfo({ rideId, driverEmail, lang, rideDetails }: BookingInfoProps) {
    const [bookings, setBookings] = useState<BookingType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

    const getBookingStatus = (statusCode: string) => {
        return BookingStatus[statusCode]
    }

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/book?ride_id=${rideId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings')
                }
                const data = await response.json()
                setBookings(data)
            } catch (err) {
                setError('Error fetching bookings')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookings()
    }, [rideId])

    useEffect(() => {
        let count: number = 0;
        for (const booking of bookings) {
            if (booking.status == '2') {
                count++
            }
        }
        setConfirmedBookingsNumber(count)
    }, [bookings])
    const [isDriver, setIsDriver] = useState(false);
    const [isPassenger, setIsPassenger] = useState(false);
    const [passengerEmail, setPassengerEmail] = useState("")
    const [confirmedBookingsNumber, setConfirmedBookingsNumber] = useState<number>(0)

    useEffect(() => {
        async function LoadData() {
            const { t } = await useTranslation(lang, 'common');
            setT(() => t);
        }
        LoadData();
        if (typeof window !== 'undefined') {
            const pEmail = localStorage.getItem('passengerEmail')
            if (pEmail) {
                setPassengerEmail(pEmail)
                setIsPassenger(true)
            }
            const dEmail = localStorage.getItem('driverEmail')
            if (dEmail) {
                //setDriverEmail(dEmail)
                setIsDriver(true)
            }
        }
    }, [])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsDriver(localStorage.getItem('driverEmail') === driverEmail);
        }
    }, [driverEmail]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-24">{t('loading')}</div>
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    const filteredBookings = isDriver
        ? bookings
        : bookings.filter(booking => booking.passenger_email === passengerEmail)

    // if (filteredBookings.length === 0) {
    //     return <></>
    // }

    const handlePassengerClick = async (bookingId: number) => {
        try {
            const response = await fetch('/api/book', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    status: '4', // Cancelled By Passenger
                }),
            });

            if (response.ok) {
                // Update the local state to reflect the change
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.id === bookingId ? { ...booking, status: '4' } : booking
                    )
                );
                //alert(t('rideshare.bookings.cancelSuccess'));
            } else {
                throw new Error('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert(t('rideshare.bookings.cancelError'));
        }
    };

    const handleDriverClick = async (bookingId: number, action: 'reject' | 'confirm') => {
        if (action === 'reject') {
            setCurrentBookingId(bookingId);
            setShowRejectModal(true);
        } else {
            try {
                if (confirmedBookingsNumber !== null && rideDetails.seats) {
                    const availableSeats = rideDetails.seats as number;
                    if (availableSeats - confirmedBookingsNumber <= 0) {
                        // Show a confirmation dialog to the driver
                        const confirmOverbook = window.confirm(t('rideshare.bookings.confirmOverbookMessage'));
                        if (!confirmOverbook) {
                            return; // If the driver doesn't confirm, don't proceed with the booking
                        }
                    }
                }
            } catch (e) {
                console.error("Error checking vacancy:", e);
                setError(t('rideshare.bookings.errorCheckingVacancy'));
            }
            await updateBookingStatus(bookingId, '2');
        }
    };

    const handleRejectSubmit = async () => {
        if (currentBookingId) {
            await updateBookingStatus(currentBookingId, '3', rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            setCurrentBookingId(null);
        }
    };

    const updateBookingStatus = async (bookingId: number, status: string, reason?: string) => {
        try {
            const response = await fetch('/api/book', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    status,
                    rejectReason: reason,
                }),
            });

            if (response.ok) {
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.id === bookingId ? { ...booking, status, reject_reason: reason } : booking
                    )
                );
                alert(t(status === '2' ? 'rideshare.bookings.confirmSuccess' : 'rideshare.bookings.rejectSuccess'));
            } else {
                throw new Error(`Failed to ${status === '2' ? 'confirm' : 'reject'} booking`);
            }
        } catch (error) {
            console.error(`Error updating booking:`, error);
            alert(t(`rideshare.bookings.${status === '2' ? 'confirm' : 'reject'}Error`));
        }
    };

    return (<>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[rgb(40,76,96)] border-b pb-2">{t('rideshare.bookings.BookedSeats')}</h2>
            <div className="space-y-6">
                {confirmedBookingsNumber}
            </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[rgb(40,76,96)] border-b pb-2">{t('rideshare.bookings.bookings')}</h2>
            <div className="space-y-6">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <InfoItem icon={<FaUser />} label={t('rideshare.bookings.passengerName')} value={booking.passenger_name} />
                                <InfoItem icon={<FaEnvelope />} label={t('rideshare.bookings.passengerEmail')} value={booking.passenger_email} />
                                {isDriver && (
                                    <InfoItem icon={<FaPhone />} label={t('rideshare.bookings.passengerPhone')} value={booking.passenger_phone} />
                                )}
                            </div>
                            <div className="space-y-2">
                                <InfoItem icon={<FaCalendarAlt />} label={t('rideshare.bookings.bookingDate')} value={new Date(booking.booking_date).toLocaleString()} />
                                <StatusItem status={booking.status} getBookingStatus={getBookingStatus} t={t} />
                            </div>
                        </div>

                        {renderActionButtons(booking)}
                    </div>
                ))}
            </div>

            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">{t('rideshare.bookings.rejectReason')}</h2>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        rows={4}
                        placeholder={t('rideshare.bookings.rejectReasonPlaceholder')}
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleRejectSubmit}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            {t('submit')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    </>
    )

    function renderActionButtons(booking: BookingType) {
        if (isDriver && booking.status == '1') {
            return (
                <div className="mt-4 flex justify-end space-x-2">
                    <ActionButton
                        onClick={() => handleDriverClick(booking.id, 'reject')}
                        className="bg-red-500 hover:bg-red-600"
                        icon={<FaTimesCircle />}
                        label={t('rideshare.bookings.rejectButton')}
                    />
                    <ActionButton
                        onClick={() => handleDriverClick(booking.id, 'confirm')}
                        className="bg-green-500 hover:bg-green-600"
                        icon={<FaCheckCircle />}
                        label={t('rideshare.bookings.confirmButton')}
                    />
                </div>
            );
        } else if (isPassenger && booking.status == '1') {
            return (
                <div className="mt-4 flex justify-end">
                    <ActionButton
                        onClick={() => handlePassengerClick(booking.id)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                        icon={<FaTimesCircle />}
                        label={t('rideshare.bookings.cancelButton')}
                    />
                </div>
            );
        }
        return null;
    }
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-[rgb(40,76,96)]">{icon}</span>
            <span className="text-gray-600 font-medium">{label}:</span>
            <span className="text-gray-800">{value}</span>
        </div>
    );
}

function StatusItem({ status, getBookingStatus, t }: { status: string, getBookingStatus: (status: string) => string, t: (key: string) => string }) {
    const statusColors: { [key: string]: string } = {
        '1': 'text-yellow-500',
        '2': 'text-green-500',
        '3': 'text-red-500',
        '4': 'text-gray-500'
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-[rgb(40,76,96)]"><FaCheckCircle /></span>
            <span className="text-gray-600 font-medium">{t('rideshare.bookings.status')}:</span>
            <span className={`font-semibold ${statusColors[status]}`}>
                {t(getBookingStatus(status))}
            </span>
        </div>
    );
}

function ActionButton({ onClick, className, icon, label }: { onClick: () => void, className: string, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 text-white rounded-full transition-colors ${className}`}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );
}