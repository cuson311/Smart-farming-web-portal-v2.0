import userApi from "@/api/userAPI";
import ScriptCard from "../script/script-list/ScriptCard";
import { useFetchTopScripts } from "@/hooks/useFetchUser";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Pagination from "../ui/pagination";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 6;

const TopScriptList = () => {
  const t = useTranslations("profile.topScripts");
  const { userId } = useParams() as { userId: string };
  const { toast } = useToast();
  const [authUserId, setAuthUserId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState<"favorite" | "rating">("favorite");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setAuthUserId(userId);
    }
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterBy]);

  const {
    data: scripts,
    loading: scriptLoading,
    error: scriptError,
    refetch,
  } = useFetchTopScripts(userId, filterBy);

  // Explicitly refetch when filterBy changes
  useEffect(() => {
    refetch();
  }, [filterBy, refetch]);

  // Calculate pagination values
  const totalPages = scripts ? Math.ceil(scripts.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScripts = scripts ? scripts.slice(startIndex, endIndex) : [];

  const handleFilterChange = (newFilter: "favorite" | "rating") => {
    if (newFilter !== filterBy) {
      setFilterBy(newFilter);
    }
  };

  if (scriptLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    const action = isFavorite ? "remove" : "add";
    try {
      await userApi.favoriteScript(authUserId, id, action);
      toast({
        title: "Success",
        description: t("favorite.success"),
      });
      refetch();
    } catch (error) {
      console.error("Error update favorite scripts", error);
      toast({
        title: "Error",
        description: t("favorite.error"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <div className="flex space-x-2 bg-secondary rounded-lg p-1">
          <button
            className={`px-3 py-1 text-sm rounded ${
              filterBy === "rating"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary-foreground/10"
            }`}
            onClick={() => handleFilterChange("rating")}
          >
            {t("filters.rating")}
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              filterBy === "favorite"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary-foreground/10"
            }`}
            onClick={() => handleFilterChange("favorite")}
          >
            {t("filters.favorite")}
          </button>
        </div>
      </div>

      {!scripts || scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">{t("empty.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TopScriptList;
