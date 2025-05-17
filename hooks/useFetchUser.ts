import { useState, useEffect, useCallback } from "react";
import userApi from "../api/userAPI";
import { Script, ScriptsListOptions, ScriptsResponse } from "@/types/script";
import {
  NotificationQueryParams,
  NotiInfo,
  UserActivity,
  UserProfile,
} from "@/types/user";
import {
  Model,
  ModelsListOptions,
  RegisteredModelsResponse,
} from "@/types/model";
import notificationApi from "@/api/notificationAPI";

const useFetchProfile = (userId: string) => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const scripts = await userApi.profile(userId);
      setData(scripts);
    } catch (err) {
      console.error("Error fetching top scripts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, error, refetch: fetchProfile };
};

const useFetchTopScripts = (userId: string, filterBy: string) => {
  const [data, setData] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchTopScripts = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const scripts = await userApi.topScripts(userId, filterBy);
      setData(scripts);
    } catch (err) {
      console.error("Error fetching top scripts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, filterBy]);

  useEffect(() => {
    fetchTopScripts();
  }, [fetchTopScripts]);

  return { data, loading, error, refetch: fetchTopScripts };
};

const useFetchActivities = (userId: string, year: string) => {
  const [data, setData] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTopScripts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await userApi.activities(userId, year);
        setData(data);
      } catch (err) {
        console.error("Error fetching Activities:", err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScripts();
  }, [userId, year]);

  return { data, loading, error };
};

const useFetchScriptsList = (userId: string, options?: ScriptsListOptions) => {
  const [data, setData] = useState<ScriptsResponse>({
    data: [],
    total: 0,
    page: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchScriptsList = useCallback(
    async (overrideOptions?: ScriptsListOptions) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const scripts = await userApi.scriptsList(
          userId,
          overrideOptions || options
        );
        setData(scripts);
      } catch (err) {
        console.error("Error fetching scripts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [userId, JSON.stringify(options)]
  );

  useEffect(() => {
    fetchScriptsList();
  }, [fetchScriptsList]);

  return { data, loading, error, refetch: fetchScriptsList };
};

const useFetchModelsList = (options?: ModelsListOptions) => {
  const [data, setData] = useState<RegisteredModelsResponse>({
    registered_models: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchModelsList = useCallback(
    async (fetchOptions?: ModelsListOptions) => {
      setLoading(true);
      setError(null);
      console.log("fetchModelsList", fetchOptions);
      try {
        const models = await userApi.modelsList(fetchOptions);
        setData(models);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchModelsList(options);
  }, [fetchModelsList, options]);

  return { data, loading, error, refetch: fetchModelsList };
};

const useFetchBookmarkList = (userId: string, options?: ScriptsListOptions) => {
  const [data, setData] = useState<ScriptsResponse>({
    data: [],
    total: 0,
    page: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchBookmarkList = useCallback(
    async (overrideOptions?: ScriptsListOptions) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const scripts = await userApi.bookmarkList(
          userId,
          overrideOptions || options
        );
        setData(scripts);
      } catch (err) {
        console.error("Error fetching favorite scripts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [userId, JSON.stringify(options)]
  );

  useEffect(() => {
    fetchBookmarkList();
  }, [fetchBookmarkList]);

  return { data, loading, error, refetch: fetchBookmarkList };
};

const useFetchSharedScripts = (
  userId: string,
  options?: ScriptsListOptions
) => {
  const [data, setData] = useState<ScriptsResponse>({
    data: [],
    total: 0,
    page: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const fetchSharedScript = useCallback(
    async (overrideOptions?: ScriptsListOptions) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const scripts = await userApi.sharedScript(
          userId,
          overrideOptions || options
        );
        setData(scripts);
      } catch (err) {
        console.error("Error fetching shared scripts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [userId, JSON.stringify(options)]
  );

  useEffect(() => {
    fetchSharedScript();
  }, [fetchSharedScript]);

  return { data, loading, error, refetch: fetchSharedScript };
};

const useFetchNotifications = (
  userId: string,
  query?: NotificationQueryParams
) => {
  const [data, setData] = useState<NotiInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationApi.allNotification(userId, query);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching favorite scripts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { data, loading, error, refetch: fetchNotifications };
};

export {
  useFetchProfile,
  useFetchTopScripts,
  useFetchActivities,
  useFetchScriptsList,
  useFetchModelsList,
  useFetchBookmarkList,
  useFetchSharedScripts,
  useFetchNotifications,
};
