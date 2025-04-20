import { NotificationQueryParams } from "@/types/user";
import axiosInstance from "./axiosInstance";

const notificationApi = {
    allNotification: async (userId: string, query?: NotificationQueryParams) => {
        const response = await axiosInstance.get(`/notification/${userId}`, {
            params: query,
        });
        return response.data;
    },

    createNotification: async (from: string, to: string[], script_id: string) => {
        const response = await axiosInstance.post(`/notification/share`, {
            from: from,
            to: to,
            script_id: script_id
        });
        return response.data;
    },

    deleteNotification: async (notiId: string) => {
        const response = await axiosInstance.delete(`/notification/${notiId}`)
        return response.data
    }
};

export default notificationApi;