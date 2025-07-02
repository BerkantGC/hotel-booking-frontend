"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_SOCKET } from '@/utils/API';
import { Notification } from '@/utils/types';

interface SocketProviderProps {
    children: React.ReactNode;
    token: string;
}

interface NotificationData {
    notification: any;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    notifications: Notification[];
    clearNotifications: () => void;
    sendMessage: (destination: string, data: any) => void;
    error: string | null;
}

const SocketContext = createContext<SocketContextType>({ 
    socket: null, 
    isConnected: false,
    notifications: [],
    clearNotifications: () => {},
    sendMessage: () => {},
    error: null
});
const socketUrl = BASE_SOCKET;

const SocketProvider = ({ children, token }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);

    const clearNotifications = () => {
        setNotifications([]);
    };

    const sendMessage = (destination: string, data: any) => {
        if (socket && isConnected) {
            socket.emit(destination, data);
        }
    };

    useEffect(() => {
        if (token) {
            console.log('Socket.IO: Attempting connection');
            
            const newSocket = io(socketUrl, {
                auth: {
                    token: `${token}`
                }
            });

            newSocket.on('connect', () => {
                console.log('Socket.IO: Connected', newSocket.id);
                setIsConnected(true);
                // User room is automatically joined by the server, no need to emit join
            });

            newSocket.on("notifications", (data: {notifications: any}) => {
                console.log('Socket.IO: Received notification', data);
                // Add notification to the list

                setNotifications(data);
            });

            // Fixed: Listen for 'notification' (singular) to match server emission
            newSocket.on('notification', (data: NotificationData) => {
                console.log('Socket.IO: Received notification', data);
                // Add notification to the list
                const newNotification: Notification = {
                    id: Date.now().toString(),
                    message: data.notification?.message || 'New notification',
                    timestamp: new Date().toISOString(),
                    type: data.notification?.type || 'info'
                };
                setNotifications(prev => [newNotification, ...prev]);
            });

            newSocket.on('connect_error', (error: any) => {
                console.error('Socket.IO: Connection error', error.message);
                setIsConnected(false);
                setError(`Connection error: ${error.message}`);
                // Handle authentication errors or connection failures
            });

            newSocket.on('error', (error: any) => {
                console.error('Socket.IO: Server error', error);
                setError(`Server error: ${error.message || error}`);
            });

            newSocket.on('disconnect', (reason: string) => {
                console.log('Socket.IO: Disconnected', reason);
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
                setIsConnected(false);
            };
        }
    }, [token]);

    return(
        <SocketContext.Provider value={{ socket, isConnected, notifications, clearNotifications, sendMessage, error }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = (): SocketContextType => {
    return useContext(SocketContext);
}

// Convenience hook to get just the socket instance
export const useSocketInstance = (): Socket | null => {
    const { socket } = useContext(SocketContext);
    return socket;
}

export default SocketProvider;