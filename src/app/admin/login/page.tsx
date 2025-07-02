"use client";
import { fetchService } from "@/utils/fetchService";
import { storeSession, storeAdmin } from "@/actions/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        
        const username = (event.currentTarget.username as HTMLInputElement).value;
        const password = (event.currentTarget.password as HTMLInputElement).value;

        try {
            const response = await fetchService('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response) {
                const data = response
                await storeSession({ username, token: data.token });
                await storeAdmin();
                router.push('/admin/dashboard');
            } else {
                setError("Invalid username or password");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <form onSubmit={login}>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username"
                            className="w-full p-2 border rounded" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            className="w-full p-2 border rounded" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;