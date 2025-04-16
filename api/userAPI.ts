import { ScriptsListOptions } from "@/types/script";
import axiosInstance from "./axiosInstance";
import qs from 'qs';

const userApi = {
  profile: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/profile`);
    //console.log("Fetch data: ", response.data);
    return response.data;
  },

  editProfile: async (userId: string, updateInfo: any) => {
    const response = await axiosInstance.put(`/${userId}`, updateInfo);
    //console.log("Fetch data: ", response.data);
    return response.data;
  },

  topScripts: async (userId: string, filterBy: string) => {
    const response = await axiosInstance.get(`/${userId}/scripts/top?filterBy=${filterBy}`);
    return response.data;
  },

  activities: async (userId: string, year: string) => {
    const response = await axiosInstance.get(`/${userId}/activities`, {
      params: { year },
    });
    return response.data;
  },

  scriptsList: async (
    userId: string,
    options: ScriptsListOptions
  ) => {
    const query = qs.stringify(options, { arrayFormat: 'repeat' });
    const response = await axiosInstance.get(`/${userId}/scripts?${query}`);
    return response.data;
  },

  modelsList: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/models/get-all`);
    return response.data;
  },

  searchUser: async (searchUserTerm: string, options: {
    page: string;
    limit: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }) => {
    const response = await axiosInstance.get(`/users/search`, {
      params: {
        username: searchUserTerm,
        page: options.page,
        limit: options.limit,
        sortBy: options.sortBy,
        order: options.order,
      },
    });
    console.log("Search Result: ", response.data);
    return response.data;
  },

  bookmarkList: async (userId: string, options: ScriptsListOptions) => {
    const query = qs.stringify(options, { arrayFormat: 'repeat' });
    const response = await axiosInstance.get(`/${userId}/favorite-script?${query}`);
    return response.data;
  },

  favoriteScript: async (userId: string, scriptId: string, action: string) => {
    const response = await axiosInstance.put(`/${userId}/favorite`, {
      scriptId: scriptId,
      action: action,
    });
    return response.data;
  },

  sharedScript: async (userId: string, options: ScriptsListOptions) => {
    const query = qs.stringify(options, { arrayFormat: 'repeat' });
    const response = await axiosInstance.get(`/${userId}/shared-script?${query}`);
    return response.data;
  },
};

export default userApi;
