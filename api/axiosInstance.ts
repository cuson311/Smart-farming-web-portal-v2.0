import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT; // Replace with your Back-end API

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Interceptor to automatically add tokens to the request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
