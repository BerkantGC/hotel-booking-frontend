// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchService } from "@/utils/fetchService";
import { storeSession } from "@/actions/authApi";

export default function LoginPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetchService("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.error) {
        throw new Error(response.message || "Login failed");
      }

      if (!response.token) {
        throw new Error("No token received");
      }

      if (!(await storeSession({username: username, token: response.token}))) {
        throw new Error("Failed to store token");
      }

      router.push(searchParams.has("redirect") ? `${searchParams.get("redirect")}` :  "/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          className="w-full p-3 border rounded mb-4"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
