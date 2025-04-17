import Link from "next/link";
import { Code2, Heart, Star } from "lucide-react";
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
            <span className="flex items-center justify-center">
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
            </span>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {script.description ? script.description : "No description"}
          </CardDescription>
        </div>
        <div className="flex items-center flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex items-center justify-center"
            onClick={() =>
              toggleFavorite(script._id, script.isFavorite, refetch)
            }
          >
            <Heart
              className={script.isFavorite ? "fill-red-500 text-red-500" : ""}
              size={16}
            />
            <span className="sr-only">Favorite</span>
          </Button>

          <span className="text-sm text-muted-foreground">
            {script.favorite || 0}{" "}
            {(script.favorite || 0) <= 1 ? "favorite" : "favorites"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 py-0">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const value = script.rating?.avg ?? 0;
                const isFullStar = star <= Math.floor(value);
                const isPartialStar =
                  !isFullStar && star === Math.ceil(value) && value % 1 !== 0;

                return (
                  <div key={star} className="relative w-4 h-4">
                    {/* Base/empty star */}
                    <Star
                      size={16}
                      className="absolute text-gray-300 dark:text-gray-600"
                    />

                    {/* Full or partial star overlay */}
                    {(isFullStar || isPartialStar) && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          width: isFullStar ? "100%" : `${(value % 1) * 100}%`,
                        }}
                      >
                        <Star
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground">
              {script.rating?.avg ? script.rating.avg.toFixed(1) : "0"}
              {script.rating?.count ? ` (${script.rating.count})` : ""}
            </span>
          </div>
        </div>
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
