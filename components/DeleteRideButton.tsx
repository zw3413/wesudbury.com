'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaEllipsisV } from 'react-icons/fa'

interface DeleteRideButtonProps {
    rideKey: string
    driverEmail: string
    lang: string
    translations: {
        deleteRide: string
        confirmDelete: string
    }
}

export default function DeleteRideButton({ rideKey, driverEmail, lang, translations }: DeleteRideButtonProps) {
    const [isDriver, setIsDriver] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const storedDriverEmail = localStorage.getItem('driverEmail')
        setIsDriver(storedDriverEmail === driverEmail)

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [driverEmail])

    const handleDeleteRide = async () => {
        if (confirm(translations.confirmDelete)) {
            try {
                const response = await fetch(`/api/ride?key=${encodeURIComponent(rideKey)}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    router.push(`/${lang}/rideshare/offer`)
                } else {
                    console.error('Failed to delete ride')
                }
            } catch (error) {
                console.error('Error deleting ride:', error)
            }
        }
    }

    if (!isDriver) return null

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none p-2"
            >
                <FaEllipsisV size={20} />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                        <button
                            onClick={handleDeleteRide}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            {translations.deleteRide}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}