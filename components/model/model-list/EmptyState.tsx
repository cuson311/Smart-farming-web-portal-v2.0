import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreate: () => void;
  title?: string;
  description?: string;
}

const EmptyState = ({
  onCreate,
  title = "No models yet",
  description = "Get started by creating your first irrigation model.",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Model
      </Button>
    </div>
  );
};
export default EmptyState;
