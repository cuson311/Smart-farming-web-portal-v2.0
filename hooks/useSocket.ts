import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import notificationApi from "../api/notificationAPI";

const socket = io('http://localhost:3004', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    auth: { token: 'your_jwt_token' },
    query: { userId: localStorage.getItem('userId') },
    timeout: 20000,
    forceNew: false
});

export const useSocket = () => {
    const [notifications, setNotifications] = useState<any>([]);
    const [ring, setRing] = useState(false);
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const data = await notificationApi.allNotification(userId ? userId : '');
                setNotifications(data);
            } catch (err) {
                console.error("Error fetching notification:", err);
                //setError(err);
            }
        };

        fetchNotification();
    }, [userId]);

    useEffect(() => {
        // Listen for notifications from the server
        socket.on('receiveNotification', async (data) => {
            //console.log('Received notification:', data);
            const notify = await notificationApi.notification(userId ? userId : '', data.id);
            setRing(true);
            setNotifications((prev: any) => [...prev, notify]);
        });

        return () => {
            socket.off('receiveNotification'); // Cleanup on unmount
        };
    }, []);

    return { notifications, socket, ring, setRing };
};