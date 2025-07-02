import { HotelListResponse } from "@/utils/types";
import { fetchService } from "@/utils/fetchService";

export const getAdminHotels = async (): Promise<HotelListResponse[]> => {
    return await fetchService(`/admin/hotels`);
};
