import { useState, useEffect, useCallback } from "react";
import userApi from "../api/userAPI";
import { Script } from "@/types/script";
import { UserProfile } from "@/types/user";

const useFetchProfile = (userId: string) => {
    const [data, setData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.profile(userId);
                //console.log("Response user's Profile fetch: ", userId, data);
                localStorage.setItem("curUsername", data.username);
                setData(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                // setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

const useFetchTopScripts = (userId: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchTopScripts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.topScripts(userId);
                setData(data);
            } catch (err) {
                console.error("Error fetching top Scripts:", err);
                // setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScripts();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

const useFetchActivities = (userId: string, year: string) => {
    const [data, setData] = useState([]);
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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchBookmarkList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.bookmarkList(userId);
                console.log("Fetch bookmark list", data);
                setData(data);
            } catch (err) {
                console.error("Error fetching bookmark list:", err);
                // setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkList();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

export {
    useFetchProfile,
    useFetchTopScripts,
    useFetchActivities,
    useFetchScriptsList,
    useFetchModelsList,
    useFetchBookmarkList
};
