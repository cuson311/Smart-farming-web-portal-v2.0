import { useState, useEffect, useCallback } from "react";
import scriptApi from "../api/scriptAPI";
import { Script } from "@/types/script";
import { UserScriptRate } from "@/types/user";

const useFetchScriptInfo = (userId: string, scriptId: string) => {
  const [data, setData] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   console.log("Calling fetch Data:", { userId, scriptId });
  const fetchScriptInfo = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await scriptApi.getScriptInfo(userId, scriptId);
      // console.log("Get script Info: ", data);
      setData(data);
    } catch (err) {
      console.error("Error fetching script info:", err);
      // setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, scriptId]);

  useEffect(() => {
    fetchScriptInfo();
  }, [fetchScriptInfo]);

  return { data, setData, loading, error, refetch: fetchScriptInfo };
};

const useFetchScriptFile = (
  userId: string,
  scriptId: string,
  version: number
) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //console.log("Version: ", version);

  const fetchData = useCallback(async () => {
    // No fetch condition
    if (!userId || !scriptId || version == null) return;
    if (version == -1.0) return;

    setLoading(true);
    setError(null);
    try {
      const filePath = `${userId}%2Fscript%2F${scriptId}%2Fv${version.toFixed(
        1
      )}.json`;
      const data = await scriptApi.getScriptFile(filePath);
      console.log("Fetching File data: ", data);
      setData(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error fetching script file:", err);
      // setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, scriptId, version]);

  useEffect(() => {
    if (!userId || !scriptId || version == null) return;
    if (version == -1.0) return;
    fetchData();
  }, [userId, scriptId, version]);

  // Reload function
  const reload = () => {
    fetchData();
  };

  return { data, setData, loading, error, reload };
};

const useFetchUserScriptRate = (userId: string, scriptId: string) => {
  const [data, setData] = useState<UserScriptRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchScriptRate = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await scriptApi.getScriptRate(userId, scriptId);

      // If the response indicates no rate exists, set default value
      if (!response || response.length === 0) {
        setData([
          { _id: "", user_id: userId, script_id: scriptId, rate: 0, __v: 0 },
        ]);
      } else {
        setData(response);
      }
    } catch (err) {
      console.error("Error fetching script rate:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, scriptId]);

  useEffect(() => {
    fetchScriptRate();
  }, [fetchScriptRate]);

  return { data, loading, error, refetch: fetchScriptRate };
};

export { useFetchScriptInfo, useFetchScriptFile, useFetchUserScriptRate };
