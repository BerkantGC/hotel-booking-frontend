import { getSession } from "@/actions/authApi";
import { memo } from "react";
import NotificationBell from "./NotificationBell";

const Header = async() => {
    const data = await getSession();
    
    return (
        <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                Hotel Booking
                </a>
            </div>
            <div className="flex items-center space-x-4">
                {data && <NotificationBell />}
                { data 
                ? (<a href="/profile" className="text-gray-600 hover:text-gray-900">
                        {data.username ? data.username : "User"}
                </a>)
                : (<a href="/login" className="text-gray-600 hover:text-gray-900">
                        Login
                </a>)

                }
            </div>
            </div>
        </div>
        </header>
    );
}

export default memo(Header);