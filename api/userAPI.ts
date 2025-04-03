import axiosInstance from "./axiosInstance";

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

  topScripts: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/scripts/top`);
    return response.data;
  },

  activities: async (userId: string, year: string) => {
    const response = await axiosInstance.get(`/${userId}/activities`, {
      params: { year },
    });
    return response.data;
  },

  scriptsList: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/scripts`);
    return response.data;
  },

  modelsList: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/models/get-all`);
    return response.data;
  },

  searchUser: async (searchUserTerm: string) => {
    const response = await axiosInstance.get(`/users/search`, {
      params: {
        username: searchUserTerm,
      },
    });
    console.log("Search Result: ", response.data);
    return response.data;
  },

  bookmarkList: async (userId: string) => {
    const response = await axiosInstance.get(`/${userId}/favorite-script`);
    return response.data;
  },

  favoriteScript: async (userId: string, scriptId: string, action: string) => {
    const response = await axiosInstance.put(`/${userId}/favorite`, {
      scriptId: scriptId,
      action: action,
    });
    return response.data;
  },
};

export default userApi;
