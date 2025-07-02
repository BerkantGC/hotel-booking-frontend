'use client';

import { useState, useEffect } from 'react';
import { getAdminHotels } from '@/actions/adminApi';
import { HotelListResponse } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';

const AdminDashboardPage = () => {
    const [hotels, setHotels] = useState<HotelListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await getAdminHotels();
                console.log('Fetched hotels:', data);
                setHotels(data);
            } catch (err) {
                setError('Failed to load hotels');
                console.error('Error fetching hotels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Hotel Management</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Add New Hotel
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-48">
                            <Image
                                src={hotel.image || '/placeholder-hotel.jpg'}
                                alt={hotel.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                            <p className="text-gray-600 mb-2">{hotel.location}</p>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">
                                    Rating: {hotel.rating ? hotel.rating.toFixed(1) : 'N/A'}
                                </span>
                                <span className="text-gray-700">
                                    Rooms: {hotel.room_count}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-4">
                                ${hotel.price}/night
                            </p>
                            <div className="flex space-x-2">
                                <Link 
                                    href={`/hotel/${hotel.id}`}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center"
                                >
                                    View Details
                                </Link>
                                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboardPage;