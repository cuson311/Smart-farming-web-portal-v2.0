import userApi from "@/api/userAPI";
import ScriptCard from "../script/script-list/ScriptCard";
import { useFetchTopScripts } from "@/hooks/useFetchUser";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Pagination from "../ui/pagination";

const ITEMS_PER_PAGE = 6;

const TopScriptList = () => {
  const { userId } = useParams() as { userId: string };
  const { toast } = useToast();
  const [authUserId, setAuthUserId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination values
  const totalPages = scripts ? Math.ceil(scripts.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScripts = scripts ? scripts.slice(startIndex, endIndex) : [];

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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentScripts.map((script) => (
          <ScriptCard
            key={script._id}
            script={script}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default TopScriptList;
