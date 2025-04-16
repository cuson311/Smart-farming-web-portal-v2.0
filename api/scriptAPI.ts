import axiosInstance from "./axiosInstance";

const scriptApi = {
    createScript: async (userId: string, formData: any) => {
        const response = await axiosInstance.post(`/${userId}/scripts`, formData);
        return response.data;
    },

    uploadScriptFile: async (formFileData: any) => {
        const response = await axiosInstance.post(`/files/upload`, formFileData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getScriptInfo: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.get(`/${userId}/scripts/${scriptId}`);
        return response.data;
    },

    getScriptFile: async (filePath: string) => {
        const response = await axiosInstance.get(`/files/file-content/${filePath}`);
        return response.data;
    },

    renameFile: async (userId: string, scriptId: string, oldVersion: number, newVersion: number) => {
        const response = await axiosInstance.put(`/files/rename`, {
            old_path: `${userId}/${scriptId}/v${oldVersion.toFixed(1)}.json`,
            new_path: `${userId}/${scriptId}/v${newVersion.toFixed(1)}.json`
        })
        return response.data;
    },

    updateScriptInfo: async (userId: string, scriptId: string, updateData: any) => {
        const response = await axiosInstance.put(`/${userId}/scripts/${scriptId}`, updateData);
        return response.data;
    },

    deleteScriptInfo: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.delete(`/${userId}/scripts/${scriptId}`);
        return response.data;
    },

    deleteScriptFiles: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.delete(`/files/deleteFolder`,
            { params: { path: `${userId}/script/${scriptId}` } }
        );
        return response.data;
    },

    deleteScriptFileVersion: async (userId: string, scriptId: string, version: number) => {
        const response = await axiosInstance.delete(`/files/deleteFile`,
            { params: { path: `${userId}/script/${scriptId}/v${version.toFixed(1)}.json` } }
        );
        return response.data;
    },

    getScriptTotalRate: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.get(`${userId}/scripts/${scriptId}/total-rate`);
        return response.data
    },

    getScriptRate: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.get(`${userId}/scripts/${scriptId}/rate`);
        return response.data
    },

    createScriptRate: async (userId: string, scriptId: string, formData: any) => {
        const response = await axiosInstance.post(`${userId}/scripts/${scriptId}/rate`, formData);
        return response.data
    },

    updateScriptRate: async (userId: string, scriptId: string, formData: any) => {
        const response = await axiosInstance.put(`${userId}/scripts/${scriptId}/rate`, formData);
        return response.data
    },

    deleteScriptRate: async (userId: string, scriptId: string) => {
        const response = await axiosInstance.delete(`${userId}/scripts/${scriptId}/rate`);
        return response.data
    },
};

export default scriptApi;
