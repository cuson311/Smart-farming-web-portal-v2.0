"use client";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, SearchCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import modelApi from "@/api/modelAPI";
import { GeneratedScript, Model, SubscribedModel } from "@/types/model";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/formatDate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This component will be rendered on invalid tab routes
const NotFoundComponent = ({ userId }: { userId: string }) => {
  const t = useTranslations("dashboard.generated_scripts");
  const router = useRouter();
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const currentLocale = window.location.pathname.split("/")[1];
            router.push(
              `/${currentLocale}/dashboard/${userId}/generated_scripts`
            );
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back", { defaultValue: "Back" })}</span>
        </Button>
        <h1 className="text-2xl font-bold">
          {t("notFound.title", { defaultValue: "Page Not Found" })}
        </h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">
          {t("notFound.invalidTab", { defaultValue: "Invalid Tab" })}
        </AlertTitle>
        <AlertDescription>
          {t("notFound.description", {
            defaultValue:
              "The requested tab does not exist. Please select a valid tab or return to your generated_scripts.",
          })}
        </AlertDescription>
        <div className="mt-4">
          <Button
            onClick={() => {
              const currentLocale = window.location.pathname.split("/")[1];
              router.push(
                `/${currentLocale}/dashboard/${userId}/generated_scripts`
              );
            }}
          >
            {t("notFound.returnButton", {
              defaultValue: "Return to My generated_scripts",
            })}
          </Button>
        </div>
      </Alert>
    </div>
  );
};

const GeneratedScriptsPage = ({ model }: { model: Model }) => {
  const t = useTranslations("dashboard.generatedScripts");
  const params = useParams();
  const router = useRouter();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    limit: 10,
    sortBy: "createdAt",
    order: "desc" as "asc" | "desc",
    location: "",
    model_name: "",
  });

  const fetchScripts = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await modelApi.getScriptsModel(userId, "", {
        ...filters,
        page,
      });
      setScripts(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      toast.error(t("toast.fetchError"), {
        description: t("toast.fetchErrorDesc"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts(currentPage);
  }, [userId, currentPage, filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async () => {
    if (!scriptToDelete) return;

    try {
      await modelApi.deleteScriptModel(userId, scriptToDelete);
      toast.success(t("toast.deleteSuccess"));
      fetchScripts(currentPage);
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error(t("toast.deleteError"), {
        description: t("toast.deleteErrorDesc"),
      });
    } finally {
      setDeleteDialogOpen(false);
      setScriptToDelete(null);
    }
  };

  const handleViewScript = (scriptId: string, modelName: string) => {
    const currentLocale = window.location.pathname.split("/")[1];
    router.push(
      `/${currentLocale}/dashboard/${userId}/models/${modelName}}/${scriptId}`
    );
  };

  return (
    <div className="space-y-6 mt-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="mb-2">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("filter.modelName")}
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t("filter.modelNamePlaceholder")}
                  value={filters.model_name}
                  onChange={(e) =>
                    handleFilterChange("model_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("filter.location")}
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t("filter.locationPlaceholder")}
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("filter.sortBy")}
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filter.sortByPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">
                      {t("filter.createdAt")}
                    </SelectItem>
                    <SelectItem value="updatedAt">
                      {t("filter.updatedAt")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("filter.order")}
                </label>
                <Select
                  value={filters.order}
                  onValueChange={(value) => handleFilterChange("order", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filter.orderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">
                      {t("filter.descending")}
                    </SelectItem>
                    <SelectItem value="asc">{t("filter.ascending")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">{t("loading")}</p>
            </div>
          ) : scripts.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("modelName")}</TableHead>
                      <TableHead>{t("version")}</TableHead>
                      <TableHead>{t("location")}</TableHead>
                      <TableHead>{t("temperature")}</TableHead>
                      <TableHead>{t("humidity")}</TableHead>
                      <TableHead>{t("rainfall")}</TableHead>
                      <TableHead>{t("lastUpdated")}</TableHead>
                      <TableHead className="text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script._id}>
                        <TableCell>{script.model_name}</TableCell>
                        <TableCell>{script.model_version}</TableCell>
                        <TableCell>{script.location}</TableCell>
                        <TableCell>{script.avg_temp}°C</TableCell>
                        <TableCell>{script.avg_humid}%</TableCell>
                        <TableCell>{script.avg_rainfall}mm</TableCell>
                        <TableCell>{formatDate(script.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleViewScript(
                                        script._id,
                                        script.model_name
                                      )
                                    }
                                  >
                                    <SearchCode className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("view")}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setScriptToDelete(script._id);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("delete")}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-4"
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">{t("noScripts")}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  const currentLocale = window.location.pathname.split("/")[1];
                  router.push(`/${currentLocale}/dashboard/${userId}/models`);
                }}
              >
                {t("subscribeModel")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GeneratedScriptsPage;
