import Link from "next/link";
import { Code2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Script } from "@/types/script";

interface ScriptCardProps {
  script: Script;
  toggleFavorite: (id: string) => void;
}

const ScriptCard = ({ script, toggleFavorite }: ScriptCardProps) => {
  return (
    <Card key={script._id}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            {script.name}
          </CardTitle>
          <CardDescription>{script.description}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleFavorite(script._id)}
        >
          <Star
            className={script.favorite ? "fill-yellow-400 text-yellow-400" : ""}
            size={16}
          />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardHeader>

      {/* {script.tags && script.tags.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {script.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      )}
       */}
      <CardFooter className="flex items-center justify-between">
        {/* {script.lastUpdated && (
          <span className="text-sm text-muted-foreground">
            Updated {new Date(script.lastUpdated).toLocaleDateString()}
          </span>
        )} */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/scripts/${script._id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ScriptCard;
