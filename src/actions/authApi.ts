"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionData {
    username: string;
    token: string;
}


export async function handleUnauthorized() {
    redirect('/logout');
}

export async function clearSession(): Promise<void> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("username");
        cookieStore.delete("token");

        redirect("/");
    } catch (error) {
        console.error("Failed to clear session:", error);
    }
}

export async function storeSession(data: SessionData): Promise<boolean> {
    try {
        (await cookies()).set("username", data.username);
        (await cookies()).set("token", data.token)

        return true;
    } catch (error) {
        console.error("Failed to store token:", error);
        return false;
    }
}

export async function storeAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        cookieStore.set("isAdmin", "true");

        return true;
    } catch (error) {
        console.error("Failed to store admin status:", error);
        return false;
    }
}

export async function getSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const username = cookieStore.get("username")?.value || "";
        const token = cookieStore.get("token")?.value || "";

        if (!username || !token) {
            return null;
        }

        return { username, token };
    } catch (error) {
        console.error("Failed to get session:", error);
        return null;
    }
}