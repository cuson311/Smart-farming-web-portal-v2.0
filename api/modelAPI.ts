import { UpdateModelData } from "@/types/model";
import axiosInstance from "./axiosInstance";

const modelApi = {
  getModels: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/models/get-all`);
    return response.data;
  },
  getModelInfo: async (userId: string, modelName: string) => {
    const response = await axiosInstance.get(
      `/${userId}/models/get?name=${modelName}`
    );
    return response.data;
  },
  getModelVersion: async (userId: string, modelName: string) => {
    const response = await axiosInstance.get(
      `/${userId}/models/versions/get-all?name=${modelName}`
    );
    return response.data;
  },
  createModel: async (userId: string, formData: any) => {
    const response = await axiosInstance.post(
      `/${userId}/models/create`,
      formData
    );
    return response.data;
  },
  createScriptModel: async (userId: string, formData: any) => {
    const response = await axiosInstance.post(
      `/${userId}/models/scripts/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
  getScriptsModel: async (usedId: string, modelId: string) => {
    const response = await axiosInstance.get(
      `/${usedId}/models/scripts/get-all?model_id=${modelId}`
    );
    return response.data;
  },
  getScriptsModelVersion: async (
    userId: string,
    modelId: string,
    version: string
  ) => {
    const response = await axiosInstance.get(
      `/${userId}/models/scripts/get?model_id=${modelId}&version=${version}`
    );
    return response.data;
  },
  updateModelInfo: async (userId: string, updateData: UpdateModelData) => {
    const response = await axiosInstance.patch(
      `/${userId}/models/update`,
      updateData
    );
    return response.data;
  },
  deleteModelInfo: async (userId: string, name: string) => {
    const response = await axiosInstance.delete(`/${userId}/models/delete`, {
      data: {
        name,
      },
    });
    return response.data;
  },
  setModelSchedule: async (userId: string, formData: any) => {
    const response = await axiosInstance.post(
      `/${userId}/models/set-schedule`,
      formData
    );
    return response.data;
  },
  getModelSchedule: async (userId: string, modelId: string) => {
    const response = await axiosInstance.get(
      `/${userId}/models/get-schedule?model_id=${modelId}`
    );
    return response.data;
  },
};

export default modelApi;
