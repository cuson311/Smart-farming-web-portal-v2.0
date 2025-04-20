import { useState, useEffect, useCallback } from "react";
import commentApi from "../api/commentAPI";
import { ScriptComment } from "@/types/comment";

const useFetchComments = (userId: string, scriptId: string, query?: {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  const [data, setData] = useState<ScriptComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchAllComment = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await commentApi.getAllComments(userId, scriptId, query);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching all commments:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, JSON.stringify(query)]);

  useEffect(() => {
    fetchAllComment();
  }, [fetchAllComment]);

  return { data, setData, loading, error, refetch: fetchAllComment };
};

const useFetchSubComments = (userId: string, scriptId: string, commentId: string) => {
  const [data, setData] = useState<ScriptComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchAllSubComment = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await commentApi.getAllSubComments(userId, scriptId, commentId);
      setData(res);
    } catch (err) {
      console.error("Error fetching sub comments:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllSubComment();
  }, [fetchAllSubComment]);


  return { data, setData, loading, error, refetch: fetchAllSubComment };
};

const useFetchCommentHistory = (userId: string, scriptId: string, commentId: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   console.log("Calling fetch Data:", { userId, scriptId });
  useEffect(() => {
    // console.log("UseEffect is running");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await commentApi.getCommentHistory(
          userId,
          scriptId,
          commentId
        );
        // console.log("Get script Info: ", data);
        setData(data);
      } catch (err) {
        console.error("Error fetching comments history:", err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, scriptId, commentId]);

  return { data, setData, loading, error };
};
export { useFetchComments, useFetchSubComments, useFetchCommentHistory };
