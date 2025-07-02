"use client";

import { useEffect } from "react";
import { clearSession } from "@/actions/authApi";

const LogoutPage = () => {

    useEffect(() => {
        const clearUserSession = async () => {
            await clearSession();
        };
        clearUserSession();
    }, []);     

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">You have been logged out</h1>
            <p className="text-lg mb-6">Thank you for using our service!</p>
            <a href="/" className="text-blue-500 hover:underline">Returning to Home</a>
            </div>
        </div>
    );
}

export default LogoutPage;