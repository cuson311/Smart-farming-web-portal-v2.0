import React, { useState, useEffect } from "react";
import io, { Socket } from 'socket.io-client';
import notificationApi from "../api/notificationAPI";

// Create a function to initialize the socket to handle SSR safely
const initializeSocket = (): Socket | null => {
    // Only initialize socket on the client side
    if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId');

        return io('http://localhost:3004', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            auth: { token: 'your_jwt_token' },
            query: { userId },
            timeout: 20000,
            forceNew: false
        });
    }
    return null;
};

export const useSocket = () => {
    const [notifications, setNotifications] = useState<any>([]);
    const [ring, setRing] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Initialize socket and userId safely after component mounts
    useEffect(() => {
        // Only run in browser environment
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem('userId');
            setUserId(id);
            setSocket(initializeSocket());
        }
    }, []);

    // Fetch notifications after userId is available
    useEffect(() => {
        if (!userId) return;

        const fetchNotification = async () => {
            try {
                const data = await notificationApi.allNotification(userId || '');
                setNotifications(data);
            } catch (err) {
                console.error("Error fetching notification:", err);
            }
        };

        fetchNotification();
    }, [userId]);

    // Set up socket listeners after socket is available
    useEffect(() => {
        if (!socket || !userId) return;

        // Listen for notifications from the server
        socket.on('receiveNotification', async (data) => {
            const notify = await notificationApi.notification(userId, data.id);
            setRing(true);
            setNotifications((prev: any) => [...prev, notify]);
        });

        return () => {
            socket.off('receiveNotification'); // Cleanup on unmount
        };
    }, [socket, userId]);

    return { notifications, socket, ring, setRing };
};