import { getSession } from "@/actions/authApi";
import Book from "@/components/pages/Book";
import { fetchService } from "@/utils/fetchService";
import { HotelListResponse } from "@/utils/types";
import { redirect } from "next/navigation";

const BookPage = async({ params }: { params: { id: string } }) => {
    const {id} = await params;

    await getSession().then(session => {
        if (!session?.username || !session?.token) {
            // Redirect to login if user is not signed in
            redirect(`/login?redirect=/hotel/${id}/book`);
        }
    });

    const response =  await fetchService(`/hotels/${params.id}`); // Checking for valid token
    
    if (response?.status === 401) {
        // Handle unauthorized access
        redirect(`/login?redirect=/hotel/${id}/book`);
    }

    const hotel = response as HotelListResponse;

    return (
        <Book hotel={hotel} />
    );
}

export default BookPage;