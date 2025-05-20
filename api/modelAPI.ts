import {
  CreateGeneratedScriptData,
  CreateModelVersionData,
  DeleteModelTagData,
  NewModelScheduleData,
  SetModelTagData,
  UpdateModelData,
} from "@/types/model";
import axiosInstance from "./axiosInstance";
import qs from "qs";
import axios from "axios";

const modelApi = {
  getModels: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/models/get-all`);
    return response.data;
  },
  getModelInfo: async (modelName: string) => {
    const response = await axiosInstance.get(`/models/get?name=${modelName}`);
    return response.data;
  },
  getSubscribedModels: async (userId: string) => {
    const response = await axiosInstance.get(
      `/models/get-all-subscribed?user_id=${userId}`
    );
    return response.data;
  },
  getModelVersion: async (
    modelName: string,
    maxResults: number = 10,
    pageToken?: string,
    orderBy?: string
  ) => {
    const query = qs.stringify(
      {
        max_results: maxResults,
        page_token: pageToken,
        filter: `name='${modelName}'`,
        order_by: orderBy,
      },
      { arrayFormat: "repeat" }
    );
    const response = await axiosInstance.get(
      `/model-versions/get-all?${query}`
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
  getScriptsModel: async (
    userId: string,
    modelId: string,
    params?: {
      limit?: number;
      page?: number;
      sortBy?: string;
      order?: "asc" | "desc";
      location?: string;
      model_name?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.model_name) queryParams.append("model_name", params.model_name);
    if (modelId) queryParams.append("model_id", modelId);

    const response = await axiosInstance.get(
      `/${userId}/models/scripts/get-all?${queryParams.toString()}`
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
  setModelSchedule: async (userId: string, formData: NewModelScheduleData) => {
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
  getModelSchedulePlan: async (userId: string, end_date: string) => {
    const response = await axiosInstance.get(
      `/models/get-schedule-plan?userId=${userId}&end_date=${end_date}`
    );
    return response.data;
  },
  setEnableSchedule: async (
    userId: string,
    modelId: string,
    enableSchedule: boolean
  ) => {
    const response = await axiosInstance.patch(
      `/${userId}/models/set-enable-schedule?model_id=${modelId}`,
      {
        enableSchedule,
      }
    );
    return response.data;
  },
  setModelTag: async (userId: string, data: SetModelTagData) => {
    const response = await axiosInstance.post(
      `/${userId}/models/set-tag`,
      data
    );
    return response.data;
  },
  deleteModelTag: async (userId: string, data: DeleteModelTagData) => {
    const response = await axiosInstance.delete(
      `/${userId}/models/delete-tag`,
      {
        data,
      }
    );
    return response.data;
  },
  subscribeModel: async (data: {
    user_id: string;
    model_name: string;
    location: string;
  }) => {
    const response = await axiosInstance.post(`/models/subscribe`, data);
    return response.data;
  },
  unsubscribeModel: async (data: { user_id: string; model_name: string }) => {
    const response = await axiosInstance.delete(`/models/un-subscribe`, {
      data: data,
    });
    return response.data;
  },
  deleteScriptModel: async (userId: string, scriptId: string) => {
    const response = await axiosInstance.delete(
      `/${userId}/models/scripts/delete`,
      {
        data: {
          script_id: scriptId,
        },
      }
    );
    return response.data;
  },
  generateScript: async (userId: string, data: CreateGeneratedScriptData) => {
    const response = await axiosInstance.post(
      `/${userId}/models/scripts/generate`,
      {
        ...data,
        // avg_temp: data.avg_temp ?? 32,
        // avg_humid: data.avg_humid ?? 80,
        // avg_rainfall: data.avg_rainfall ?? 30,
      }
    );
    return response.data;
  },
  getModelScriptInfo: async (userId: string, scriptId: string) => {
    const response = await axiosInstance.get(
      `/${userId}/models/scripts/get?scriptId=${scriptId}`
    );
    return response.data;
  },
  getModelScriptFile: async (userId: string, scriptId: string) => {
    const response = await axiosInstance.get(
      `/${userId}/models/scripts/get-file?scriptId=${scriptId}`
    );
    return response.data;
  },
  createModelVersion: async (data: FormData) => {
    const response = await axios.post(
      `http://0.0.0.0:7000/model-versions/create`,
      data
    );
    return response.data;
  },
};

export default modelApi;
