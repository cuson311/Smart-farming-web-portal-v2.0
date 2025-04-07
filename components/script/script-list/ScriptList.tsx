import ScriptCard from "./ScriptCard";
import { Script } from "@/types/script";

interface ScriptListProps {
  scripts: Script[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ScriptList = ({ scripts, toggleFavorite, loading }: ScriptListProps) => {
  if (loading) {
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
export default ScriptList;
