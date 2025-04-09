import { useState, useEffect, useCallback } from "react";
import modelApi from "@/api/modelAPI";
import { Model } from "@/types/model";

const useFetchModelInfo = (userId: string, modelName: string) => {
  const [data, setData] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchScriptInfo = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await modelApi.getModelInfo(userId, modelName);
      setData(data.registered_model);
    } catch (err) {
      console.error("Error fetching script info:", err);
      // setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, modelName]);

  useEffect(() => {
    fetchScriptInfo();
  }, [fetchScriptInfo]);

  return { data, setData, loading, error, refetch: fetchScriptInfo };
};

export { useFetchModelInfo };
