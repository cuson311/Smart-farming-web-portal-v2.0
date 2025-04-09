import Link from "next/link";
import { Code2, Database, Star } from "lucide-react";
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
interface ModelCardProp {
  model: Model;
  toggleFavorite: (id: string, isFavorite: boolean) => void;
}

const ModelCard = ({ model, toggleFavorite }: ModelCardProp) => {
  const { userId } = useParams();

  return (
    <Card key={model._id}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1 w-full">
          <CardTitle className="flex items-center gap-2 w-full">
            <Database className="h-5 w-5 flex-shrink-0" />
            <span className="line-clamp-1">{model.name}</span>
          </CardTitle>
          <CardDescription>{model.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {model.__v ? <>Versions {model.__v}</> : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {model.last_updated_timestamp ? (
            <span>Updated at {formatDate(model.last_updated_timestamp)}</span>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/dashboard/${userId}/models/${model.alt_name}/?tab=overview`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ModelCard;
