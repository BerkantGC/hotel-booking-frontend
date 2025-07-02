'use client';

import { useState } from 'react';
import { Booking } from '@/utils/types';
import CommentModal from '@/components/CommentModal';
import Link from 'next/link';

interface ProfilePageClientProps {
    bookings: Booking[];
}

export default function ProfilePageClient({ bookings }: ProfilePageClientProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleCommentSuccess = () => {
        // You could add a success message or refresh logic here
        console.log('Comment submitted successfully');
    };

    return (
        <>
            <div className="w-full max-w-4xl space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <Link target="_blank" href={`/hotel/${booking.hotelId}`}>
                                <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
                                    {booking.hotelName}
                                </h3>
                            </Link>
                            <span className="text-sm text-gray-500">#{booking.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                                <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p>Guests: {booking.guestCount}</p>
                                <p>Status: <span className="capitalize">Booked</span></p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Link 
                                href={`/hotel/${booking.hotelId}/comments`}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                View Comments
                            </Link>
                            <button
                                onClick={() => handleOpenModal(booking)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                Make Comment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedBooking && (
                <CommentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    bookingId={selectedBooking.id}
                    hotelName={selectedBooking.hotelName}
                    onSuccess={handleCommentSuccess}
                />
            )}
        </>
    );
}
