import ModelCard from "./ModelCard";
import { RegisteredModel, SubscribedModel } from "@/types/model";
import ModelCardSkeleton from "../../skeleton/ModelCardSkeleton";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import modelApi from "@/api/modelAPI";
import { useToast } from "@/hooks/use-toast";

interface ModelListProps {
  models: RegisteredModel[];
  subscribedModels: SubscribedModel[];
  loading: boolean;
  onSubscribedModelsChange: () => void;
}

const ModelList = ({
  models,
  subscribedModels,
  loading,
  onSubscribedModelsChange,
}: ModelListProps) => {
  const t = useTranslations("dashboard.models");
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || "";
      setUserId(storedUserId);
    }
  }, []);

  const totalPages = Math.ceil(models.length / itemsPerPage);
  const paginatedModels = models.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubscribe = async (modelName: string, location: string) => {
    try {
      console.log("handleSubscribe");
      await modelApi.subscribeModel({
        user_id: userId,
        model_name: modelName,
        location: location,
      });
      onSubscribedModelsChange();
    } catch (error) {
      throw error;
    }
  };

  const handleUnsubscribe = async (modelName: string) => {
    try {
      console.log("handleUnsubscribe");
      await modelApi.unsubscribeModel({
        user_id: userId,
        model_name: modelName,
      });
      onSubscribedModelsChange();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CardSkeletonGrid count={6} component={<ModelCardSkeleton />} />
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">{t("emptyState.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("emptyState.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedModels.map((model) => (
          <ModelCard
            key={model.name}
            model={model}
            subscribedModels={subscribedModels}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ModelList;
