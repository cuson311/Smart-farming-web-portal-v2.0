import ModelCard from "./ModelCard";
import ScriptCard from "./ModelCard";
import { Model } from "@/types/model";
import ModelCardSkeleton from "./ModelCardSkeleton";

interface ModelListProps {
  models: Model[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ModelList = ({ models, toggleFavorite, loading }: ModelListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          <ModelCardSkeleton />
        </div>
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No models found</h3>
        <p className="text-sm text-muted-foreground">
          Create a new model or try a different search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model._id}
          model={model}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};
export default ModelList;
