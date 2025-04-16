import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import notificationApi from "../api/notificationAPI";
import { UserNotify } from "@/types/user";

interface NotificationQueryParams {
    page?: string;
    limit?: string;
    notifyId?: string;
}

export const useSocket = () => {
    const [notifications, setNotifications] = useState<UserNotify>({
        data: [],
        total: 0,
        page: "",
        totalPages: 0,
    });
    const [ring, setRing] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Get userId from localStorage after component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = localStorage.getItem("userId");
            if (id) setUserId(id);
        }
    }, []);

    // Initialize socket when userId is available
    useEffect(() => {
        if (!userId) return;

        // Close existing socket before creating a new one
        if (socket) {
            socket.disconnect();
        }

        const newSocket = io("http://localhost:3004", {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            auth: {
                token: localStorage.getItem("token") || "your_jwt_token"
            },
            query: { userId },
            timeout: 20000,
            forceNew: true,
        });

        // Debug socket connection
        newSocket.on("connect", () => {
            console.log("Socket connected successfully");
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    // Listen for login events
    useEffect(() => {
        const handleLoginSuccess = () => {
            const id = localStorage.getItem("userId");
            setUserId(id);
            setNotifications({
                data: [],
                total: 0,
                page: "",
                totalPages: 0,
            });
        };

        window.addEventListener("loginSuccess", handleLoginSuccess);
        return () => {
            window.removeEventListener("loginSuccess", handleLoginSuccess);
        };
    }, []);

    // Listen for logout events
    useEffect(() => {
        const handleLogout = () => {
            setUserId(null);
            setNotifications({
                data: [],
                total: 0,
                page: "",
                totalPages: 0,
            });
            setRing(false);
            if (socket) socket.disconnect();
        };

        window.addEventListener("logoutSuccess", handleLogout);
        return () => {
            window.removeEventListener("logoutSuccess", handleLogout);
        };
    }, [socket]);

    // Fetch notification list
    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const response = await notificationApi.allNotification(userId, {
                    page: "1",
                    limit: "5",
                });
                setNotifications(response);
            } catch (err) {
                console.error("Error fetching notification:", err);
            }
        };

        fetchNotifications();
    }, [userId]);

    // Listen to socket events for new notifications
    useEffect(() => {
        if (!socket || !userId) return;

        // Listen for notifications from the server
        socket.on('receiveNotification', async (data) => {
            console.log("Received notification socket event:", data);
            try {
                if (!data || !data.id) {
                    console.error("Invalid notification data received:", data);
                    return;
                }

                // Fetch the specific notification using allNotification with notifyId
                const result = await notificationApi.allNotification(userId, {
                    notifyId: data.id,
                    limit: "!",
                    page: "1"
                });

                console.log("Fetched notification details:", result);

                // Immediately set the ring animation
                setRing(true);

                // If we got valid notification data
                if (result && result.data && result.data.length > 0) {
                    // Get the new notification (should be first item)
                    const newNotification = result.data[0];

                    // Update notifications state in a way that maintains the UserNotify interface
                    setNotifications(prev => {
                        // First check if this notification is already in our list to avoid duplicates
                        const alreadyExists = prev.data.some(item =>
                            item._id === newNotification._id
                        );

                        if (alreadyExists) {
                            console.log("Notification already exists, not adding duplicate");
                            return prev;
                        }

                        console.log("Adding new notification to state");

                        // Create a new object with updated values to ensure React detects the change
                        return {
                            ...prev,
                            data: [newNotification, ...prev.data].slice(0, 5), // Keep top 5
                            total: prev.total + 1, // Increment total count
                        };
                    });
                } else {
                    // If for some reason we couldn't get the notification detail,
                    // refresh the full notification list as a fallback
                    console.log("Couldn't fetch specific notification, refreshing all notifications");
                    const response = await notificationApi.allNotification(userId, {
                        page: "1",
                        limit: "5",
                    });
                    setNotifications(response);
                }
            } catch (err) {
                console.error("Error handling notification:", err);
                // Attempt to refresh all notifications as a fallback
                try {
                    const response = await notificationApi.allNotification(userId, {
                        page: "1",
                        limit: "5",
                    });
                    setNotifications(response);
                } catch (fallbackErr) {
                    console.error("Error refreshing notifications:", fallbackErr);
                }
            }
        });

        return () => {
            socket.off('receiveNotification');
        };
    }, [socket, userId]);

    return { notifications, socket, ring, setRing };
};