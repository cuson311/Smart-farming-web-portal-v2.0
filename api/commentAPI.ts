import axiosInstance from "./axiosInstance";

const commentApi = {
  getAllComments: async (userId: string, scriptId: string) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments`
    );
    return response.data;
  },

  getCommentHistory: async (
    userId: string,
    scriptId: string,
    commentId: string
  ) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments/${commentId}/history`
    );
    return response.data;
  },

  getAllSubComments: async (
    userId: string,
    scriptId: string,
    commentId: string
  ) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments/${commentId}/subcomments`
    );
    return response.data;
  },

  createComment: async (userId: string, scriptId: string, formData: any) => {
    const response = await axiosInstance.post(
      `/${userId}/scripts/${scriptId}/comments`,
      formData
    );
    return response.data;
  },

  updateComment: async (
    userId: string,
    scriptId: string,
    commentId: string,
    content: string
  ) => {
    const response = await axiosInstance.put(
      `/${userId}/scripts/${scriptId}/comments/${commentId}`,
      { content: content }
    );
    return response.data;
  },

  deleteComment: async (
    userId: string,
    scriptId: string,
    commentId: string
  ) => {
    const response = await axiosInstance.delete(
      `/${userId}/scripts/${scriptId}/comments/${commentId}`
    );
    return response.data;
  },
};

export default commentApi;
