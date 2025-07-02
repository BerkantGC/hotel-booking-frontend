"use server"

import { fetchService } from "@/utils/fetchService";


export async function getRooms(hotelId: number, data: {guestCount: number, checkIn: string, checkOut: string}) {
    const {guestCount, checkIn, checkOut} = data;

    try {
        const response = await fetchService(`/hotels/${hotelId}/rooms?guestCount=${guestCount}&checkIn=${checkIn}&checkOut=${checkOut}`);

        return response;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }   
}

export async function bookRoom(data: {
    hotel_id: number,
    room_id: string,
    check_in: string,
    check_out: string,
    guest_count: number
}) {
    try {
        const response = await fetchService('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        return response;
    } catch (error) {
        console.error('Error booking room:', error);
        throw error;
    }
}