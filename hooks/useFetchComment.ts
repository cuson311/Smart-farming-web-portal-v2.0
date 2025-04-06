import { useState, useEffect } from "react";
import commentApi from "../api/commentAPI";
import { ScriptComment } from "@/types/comment";

const useFetchComments = (userId: string, scriptId: string) => {
  const [data, setData] = useState<ScriptComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   console.log("Calling fetch Data:", { userId, scriptId });
  useEffect(() => {
    // console.log("UseEffect is running");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await commentApi.getAllComments(userId, scriptId);
        // console.log("Get script Info: ", data);
        setData(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, scriptId]);

  return { data, setData, loading, error };
};

const useFetchSubComments = (userId: string, scriptId: string, commentId: string) => {
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
        const data = await commentApi.getAllSubComments(
          userId,
          scriptId,
          commentId
        );
        // console.log("Get script Info: ", data);
        setData(data);
      } catch (err) {
        console.error("Error fetching sub comments:", err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, scriptId, commentId]);

  return { data, setData, loading, error };
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
