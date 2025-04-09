import userApi from "@/api/userAPI";
import ScriptCard from "../script/script-list/ScriptCard";
import { useFetchTopScripts } from "@/hooks/useFetchUser";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const TopScriptList = () => {
  const { userId } = useParams() as { userId: string };
  const { toast } = useToast();
  const [authUserId, setAuthUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setAuthUserId(userId);
    }
  }, []);

  const {
    data: scripts,
    loading: scriptLoading,
    error: scriptError,
    refetch,
  } = useFetchTopScripts(userId);

  if (scriptLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading scripts...</div>
      </div>
    );
  }

  if (!scripts || scripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No scripts found</h3>
        <p className="text-sm text-muted-foreground">
          Create a new script or try a different search query.
        </p>
      </div>
    );
  }
  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    const action = isFavorite ? "remove" : "add";
    try {
      await userApi.favoriteScript(authUserId, id, action);
      toast({
        title: "Favorite updated",
        description: "Script favorite status has been updated.",
      });
      refetch();
    } catch (error) {
      console.error("Error update favorite scripts", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {scripts.map((script) => (
        <ScriptCard
          key={script._id}
          script={script}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};
export default TopScriptList;
