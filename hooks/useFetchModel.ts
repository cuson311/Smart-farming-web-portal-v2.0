import { useState, useEffect, useCallback } from "react";
import modelApi from "@/api/modelAPI";
import { Model } from "@/types/model";

const useFetchModelInfo = (modelName: string) => {
  const [data, setData] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchScriptInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await modelApi.getModelInfo(modelName);
      setData(data.registered_model);
      console.log("data", data);
    } catch (err) {
      console.error("Error fetching script info:", err);
      // setError(err);
    } finally {
      setLoading(false);
    }
  }, [modelName]);

  useEffect(() => {
    fetchScriptInfo();
  }, [fetchScriptInfo]);

  return { data, setData, loading, error, refetch: fetchScriptInfo };
};

export { useFetchModelInfo };
