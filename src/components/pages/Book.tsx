// app/hotel/[id]/book/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchService } from "@/utils/fetchService";
import { HotelListResponse, Room } from "@/utils/types";
import { bookRoom, getRooms } from "@/actions/booking";

interface BookProps {
    hotel: HotelListResponse;
}

export default function Book({hotel}: BookProps) {
    const router = useRouter();

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestCount, setGuestCount] = useState(1);
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    const fetchRooms = async () => {
        const response = await getRooms(hotel.id, {
            guestCount,
            checkIn,
            checkOut,   
        }) as Room[];
        
        setRooms(response || []);
    }

    useEffect(() => {
        fetchRooms()
    }, [checkIn, checkOut, guestCount, hotel.id]);

    useEffect(() => {
        if (selectedRoom) {
            if (selectedRoom) {
                const filteredDates = selectedRoom.availablityList
                    .filter((availability) => availability.count > 0)
                    .map((availability) => availability.date);
                setAvailableDates(filteredDates);
            }
        } else {
            setAvailableDates([]);
        }
    }, [selectedRoom, rooms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRoom || !checkIn || !checkOut) {
            alert("Please fill all fields.");
            return;
        }

        const payload = {
            hotel_id: Number(hotel.id),
            room_id: selectedRoom.id,
            check_in: checkIn,
            check_out: checkOut,
            guest_count: guestCount,
        };

        try {
            const response = await bookRoom(payload);


            alert("Booking successful!");
            router.push("/profile");
        } catch (err) {
            console.error(err);
            alert("Booking failed. Try again.");
        }
    };

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
                    <p className="text-lg text-gray-700">{hotel.name}</p>
                </div>

                {/* Booking Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Reservation Details</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Room Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                Select Room
                            </label>
                            <select
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white"
                                value={selectedRoom ? selectedRoom.id : ""}
                                onChange={(e) => setSelectedRoom(rooms.find(r => r.id === e.target.value) || null)}
                                required
                            >
                                <option value="">Choose your room</option>
                                {rooms.map((room) => (
                                    <option 
                                        key={room.id} 
                                        value={room.available ? room.id : ""}
                                        disabled={!room.available}
                                        className={!room.available ? "opacity-50 blur-sm" : ""}
                                    >
                                        {room.roomKind} - (Max {room.guestCount} guests) {!room.available && " - UNAVAILABLE"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Selection */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                    Check-in Date
                                </label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white"
                                    required

                                    min={availableDates.length > 0 ? availableDates[0] : undefined}
                                    max={availableDates.length > 0 ? availableDates[availableDates.length - 1] : undefined}
                                    list="available-dates"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                    Check-out Date
                                </label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white"
                                    required
                                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                                    max={availableDates.length > 0 ? availableDates[availableDates.length - 1] : undefined}
                                    list="available-dates"
                                />
                            </div>
                        </div>

                        {/* Guest Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                                Number of Guests
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Confirm Booking
                        </button>
                    </form>
                </div>

                {/* Back Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    >
                        ← Back to Hotel Details
                    </button>
                </div>
            </div>

            {/* Add a datalist for available dates */}
            <datalist id="available-dates">
                {availableDates.map((date) => (
                    <option key={date} value={date} />
                ))}
            </datalist>
        </div>
    );
}
