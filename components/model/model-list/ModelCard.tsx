import Link from "next/link";
import {
  CalendarCheck2,
  CalendarX2,
  Code2,
  Database,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Model } from "@/types/model";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
interface ModelCardProp {
  model: Model;
  toggleFavorite: (id: string, isFavorite: boolean) => void;
}

const ModelCard = ({ model, toggleFavorite }: ModelCardProp) => {
  const { userId } = useParams();
  return (
    <Card key={model._id} className="flex flex-wrap">
      <CardHeader className="flex flex-row items-start justify-between pb-2 w-full">
        <div className="space-y-1 w-full">
          <CardTitle className="flex items-center gap-2 w-full">
            <Database className="h-5 w-5 flex-shrink-0" />
            <span className="line-clamp-1">
              {model?.alt_name ? model?.alt_name : "Clone"}
            </span>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {model.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="self-end w-full flex-shrink-0">
        <div className="flex gap-2 text-s font-bold">
          Version {model.__v}
          <Badge
            className={`gap-1 `}
            variant={model.enableSchedule ? "default" : "secondary"}
          >
            {model.enableSchedule ? (
              <CalendarCheck2 size="16" />
            ) : (
              <CalendarX2 size="16" />
            )}
            {model.enableSchedule ? "Scheduled" : "Not Scheduled"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between self-end w-full flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {model.last_updated_timestamp ? (
            <span>Updated at {formatDate(model.last_updated_timestamp)}</span>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/dashboard/${userId}/models/${model.alt_name}/?tab=scripts`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ModelCard;
