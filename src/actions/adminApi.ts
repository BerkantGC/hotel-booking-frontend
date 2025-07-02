import { HotelListResponse } from "@/utils/types";
import { fetchService } from "@/utils/fetchService";

export const getAdminHotels = async (): Promise<HotelListResponse[]> => {
    return await fetchService(`/admin/hotels`);
};

export interface AddHotelPayload {
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  lat: number;
  lng: number;
}

export const addNewHotel = async (payload: AddHotelPayload) => {
  try {
    const response = await API.post('/admin/hotels', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding new hotel:', error);
    throw error;
  }
};