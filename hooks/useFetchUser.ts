import { useState, useEffect, useCallback } from "react";
import userApi from "../api/userAPI";
import { Script } from "@/types/script";
import { UserActivity, UserProfile } from "@/types/user";

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

const useFetchTopScripts = (userId: string) => {
    const [data, setData] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const fetchTopScripts = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const scripts = await userApi.topScripts(userId);
            setData(scripts);
        } catch (err) {
            console.error("Error fetching top scripts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

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

const useFetchScriptsList = (userId: string) => {
    const [data, setData] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const fetchScriptsList = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const scripts = await userApi.scriptsList(userId);
            setData(scripts);
        } catch (err) {
            console.error("Error fetching scripts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchScriptsList();
    }, [fetchScriptsList]);

    return { data, loading, error, refetch: fetchScriptsList };
};

const useFetchModelsList = (userId: string) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchModelsList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.modelsList(userId);
                console.log("Fetch models List", data);
                setData(data);
            } catch (err) {
                console.error("Error fetching models:", err);
                // setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModelsList();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

const useFetchBookmarkList = (userId: string) => {

    const [data, setData] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const fetchBookmarkList = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const scripts = await userApi.bookmarkList(userId);
            setData(scripts);
        } catch (err) {
            console.error("Error fetching favorite scripts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchBookmarkList();
    }, [fetchBookmarkList]);

    return { data, loading, error, refetch: fetchBookmarkList };
};

const useFetchSharedScripts = (userId: string) => {

    const [data, setData] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const fetchSharedScript = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const scripts = await userApi.sharedScript(userId);
            setData(scripts);
        } catch (err) {
            console.error("Error fetching shared scripts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchSharedScript();
    }, [fetchSharedScript]);

    return { data, loading, error, refetch: fetchSharedScript };
};

export {
    useFetchProfile,
    useFetchTopScripts,
    useFetchActivities,
    useFetchScriptsList,
    useFetchModelsList,
    useFetchBookmarkList,
    useFetchSharedScripts
};
