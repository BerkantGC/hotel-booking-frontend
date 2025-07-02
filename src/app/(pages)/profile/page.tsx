import { getSession } from "@/actions/authApi";
import { fetchService } from "@/utils/fetchService";
import { Booking } from "@/utils/types";
import ProfilePageClient from "./ProfilePageClient";

const ProfilePage = async() => {
    const session = await getSession();

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">You must be logged in to view this page.</p>
            </div>
        );
    }

    const response = await fetchService("/bookings/my_bookings") as Booking[];

    return (
        <div className="flex flex-col bg-white items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-8">My Bookings</h1>
            {response && response.length > 0 ? (
                <ProfilePageClient bookings={response} />
            ) : (
                <div className="text-center">
                    <p className="text-lg text-gray-500">No bookings found</p>
                    <p className="text-sm text-gray-400">Start planning your next trip!</p>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;