import axiosInstance from "./axiosInstance";

const notificationApi = {
    allNotification: async (userId: string) => {
        const response = await axiosInstance.get(`/notification/${userId}`)
        return response.data;
    },

    notification: async (userId: string, notifyId: string) => {
        const response = await axiosInstance.get(`/notification/${userId}`, {
            params: { notifyId }
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
    }
};

export default notificationApi;