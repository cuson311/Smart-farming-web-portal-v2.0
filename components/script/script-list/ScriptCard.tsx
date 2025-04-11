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
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
interface ScriptCardProps {
  script: Script;
  toggleFavorite: (
    id: string,
    isFavorite: boolean,
    refetch?: () => void
  ) => void;
  refetch?: () => void;
}

const ScriptCard = ({ script, toggleFavorite, refetch }: ScriptCardProps) => {
  const { userId } = useParams();

  return (
    <Card key={script._id}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1 ">
          <CardTitle className="flex items-center gap-2 w-full">
            <Code2 className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{script.name}</span>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {script.description ? script.description : "No description"}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleFavorite(script._id, script.isFavorite, refetch)}
        >
          <Star
            className={
              script.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
            }
            size={16}
          />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardHeader>
      <CardContent className="self-end w-full flex-shrink-0">
        <Badge
          variant={"outline"}
          className={`${
            script.privacy === "private"
              ? "text-amber-500 dark:text-amber-400"
              : "text-primary"
          }`}
        >
          {script.privacy ? script.privacy : "public"}
        </Badge>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {script.updatedAt ? (
            <span>Updated at {formatDate(script.updatedAt)}</span>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/dashboard/${script.owner_id}/scripts/${script._id}?tab=code`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ScriptCard;
