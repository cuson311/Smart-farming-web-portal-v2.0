"use client";

import { useEffect, useState } from "react";
import { Search, ArrowLeft, ShieldAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useFetchBookmarkList,
  useFetchScriptsList,
  useFetchSharedScripts,
} from "@/hooks/useFetchUser";
import NewScriptDialog from "@/components/script/script-list/NewScript";
import ScriptList from "@/components/script/script-list/ScriptList";
import { Script, ScriptsListOptions } from "@/types/script";
import userApi from "@/api/userAPI";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@/types/user";
import PublicScriptList from "@/components/script/script-list/PublicScript";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { vietnamProvinces, plantTypes } from "@/lib/constant";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// NotFoundComponent
const NotFoundComponent = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const t = useTranslations("Common");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-2xl font-bold">{t("pageNotFound")}</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">{t("invalidTab")}</AlertTitle>
        <AlertDescription>{t("invalidTabDescription")}</AlertDescription>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/${userId}/scripts?tab=all`}>
              {t("returnToDashboard")}
            </Link>
          </Button>
        </div>
      </Alert>
    </div>
  );
};

// Multi-select component with search
const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  emptyMessage = "No options found.",
  label,
}: {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  emptyMessage?: string;
  label: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemoveValue = (value: string) => {
    onChange(selectedValues.filter((item) => item !== value));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-wrap gap-1 min-h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer">
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((value) => (
                  <Badge key={value} variant="secondary" className="mr-1 mb-1">
                    {value}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveValue(value);
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {value}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        selectedValues.includes(option)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedValues.includes(option) && (
                        <CheckIcon className="h-3 w-3" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// ScriptsPage Component
const ScriptsPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const t = useTranslations("dashboard.scripts");

  // Change to arrays to support multiple selections
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);
  const [privacyFilter, setPrivacyFilter] = useState<string>("all");

  const [scriptListOptions, setScriptListOptions] =
    useState<ScriptsListOptions>({
      sortBy: "updatedAt",
      order: "desc",
      locations: [],
      plant_types: [],
    });

  const [publicScriptState, setPublicScriptState] = useState({
    userSearchTerm: "",
    searchResults: [] as UserProfile[],
    showSearchResults: false,
    selectedUser: null as { id: string; name: string } | null,
  });

  const validTabs = ["all", "favorites", "shared-scripts", "public-scripts"];
  const isValidTab = tabParam && validTabs.includes(tabParam);
  const tabName = isValidTab ? tabParam : "code";
  const disablePrivacyFilter =
    tabName === "public-scripts" || tabName === "shared-scripts";

  const handleTabChange = (value: string) => {
    const currentLocale = window.location.pathname.split("/")[1]; // Get current locale from URL
    const newUrl = `/${currentLocale}/dashboard/${params.userId}/scripts?tab=${value}`;
    router.replace(newUrl);
  };

  // Updated to apply filters with proper backend API parameter structure
  const handleFiltersChange = () => {
    // Start with base options
    const newOptions: ScriptsListOptions = {
      sortBy: scriptListOptions.sortBy,
      order: scriptListOptions.order,
    };

    // Only add properties that have values
    if (selectedLocations.length > 0) {
      newOptions.locations = selectedLocations;
    }

    if (selectedPlantTypes.length > 0) {
      newOptions.plant_types = selectedPlantTypes;
    }

    // Only add privacy if it's not "all" or null and not on public-scripts tab
    if (privacyFilter && privacyFilter !== "all" && !disablePrivacyFilter) {
      newOptions.privacy = privacyFilter;
    }

    setScriptListOptions(newOptions);

    // Refetch all data with new filters
    refetchAllScripts(newOptions);
    refetchSharedScripts(newOptions);
    refetchFavoriteScripts(newOptions);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFiltersChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect for filter changes
  useEffect(() => {
    handleFiltersChange();
  }, [selectedLocations, selectedPlantTypes, privacyFilter]);

  // Effect for tab changes - reset privacy filter when switching to public-scripts
  useEffect(() => {
    if (disablePrivacyFilter && privacyFilter !== "all") {
      setPrivacyFilter("all");
    }
  }, [tabName]);

  const handleSortChange = (
    field: "createdAt" | "updatedAt",
    order: "asc" | "desc"
  ) => {
    const newOptions = {
      ...scriptListOptions,
      sortBy: field,
      order: order,
    };
    setScriptListOptions(newOptions);
    refetchAllScripts(newOptions);
    refetchSharedScripts(newOptions);
    refetchFavoriteScripts(newOptions);
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedPlantTypes([]);
    setPrivacyFilter("all");

    // Update options and refetch
    const newOptions = {
      ...scriptListOptions,
      locations: [],
      plant_types: [],
    };
    setScriptListOptions(newOptions);
    refetchAllScripts(newOptions);
    refetchSharedScripts(newOptions);
    refetchFavoriteScripts(newOptions);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  const {
    data: allScripts,
    loading: allScriptsListLoading,
    refetch: refetchAllScripts,
  } = useFetchScriptsList(params.userId, scriptListOptions);

  const {
    data: sharedScripts,
    loading: sharedScriptsListLoading,
    refetch: refetchSharedScripts,
  } = useFetchSharedScripts(userId, scriptListOptions);

  const {
    data: favoriteScripts,
    loading: favoriteScriptsListLoading,
    refetch: refetchFavoriteScripts,
  } = useFetchBookmarkList(userId, scriptListOptions);

  const toggleFavorite = async (
    id: string,
    isFavorite: boolean,
    refetch?: () => void
  ) => {
    const action = isFavorite ? "remove" : "add";
    try {
      await userApi.favoriteScript(userId, id, action);
      toast({
        title: t("favorite.success"),
        description: t("favorite.success"),
      });
      refetchAllScripts(scriptListOptions);
      refetchSharedScripts(scriptListOptions);
      refetchFavoriteScripts(scriptListOptions);
      if (refetch) refetch();
    } catch (error) {
      toast({
        title: t("favorite.error"),
        description: t("favorite.error"),
        variant: "destructive",
      });
    }
  };

  const updatePublicScriptState = (
    newState: Partial<typeof publicScriptState>
  ) => {
    setPublicScriptState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  if (!isValidTab) {
    return <NotFoundComponent />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NewScriptDialog
            onScriptCreated={() => refetchAllScripts(scriptListOptions)}
          />
        </div>
      </div>

      {/* Filter section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-muted/30 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Multi-select Location Filter */}
          <MultiSelect
            options={vietnamProvinces}
            selectedValues={selectedLocations}
            onChange={setSelectedLocations}
            placeholder={t("selectLocations")}
            emptyMessage={t("noOptionsFound")}
            label={t("locations")}
          />

          {/* Multi-select Plant Type Filter */}
          <MultiSelect
            options={plantTypes}
            selectedValues={selectedPlantTypes}
            onChange={setSelectedPlantTypes}
            placeholder={t("selectPlantTypes")}
            emptyMessage={t("noOptionsFound")}
            label={t("plantTypes")}
          />

          {/* Privacy Filter - Only show if not on public-scripts tab */}
          {!disablePrivacyFilter && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="privacy-filter">{t("privacy")}</Label>
              <Select
                value={privacyFilter || "all"}
                onValueChange={(value) => setPrivacyFilter(value)}
              >
                <SelectTrigger id="privacy-filter" className="w-[180px]">
                  <SelectValue placeholder={t("allPrivacyTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="public">{t("public")}</SelectItem>
                  <SelectItem value="private">{t("private")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedLocations.length > 0 ||
            selectedPlantTypes.length > 0 ||
            (privacyFilter !== "all" && !disablePrivacyFilter)) && (
            <div className="flex items-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-primary hover:underline"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-nowrap mt-4 md:mt-0">
          <Label className="whitespace-nowrap">{t("sortBy")}:</Label>
          <Select
            value={scriptListOptions.sortBy}
            onValueChange={(value: "createdAt" | "updatedAt") =>
              handleSortChange(value, scriptListOptions.order as "asc" | "desc")
            }
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={t("selectField")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">{t("creationDate")}</SelectItem>
              <SelectItem value="updatedAt">{t("lastUpdate")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={scriptListOptions.order}
            onValueChange={(value: "asc" | "desc") =>
              handleSortChange(
                scriptListOptions.sortBy as "updatedAt" | "createdAt",
                value
              )
            }
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={t("selectOrder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{t("latestFirst")}</SelectItem>
              <SelectItem value="asc">{t("oldestFirst")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Tabs value={tabName} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">{t("allScripts")}</TabsTrigger>
            <TabsTrigger value="favorites">{t("favorites")}</TabsTrigger>
            <TabsTrigger value="shared-scripts">
              {t("sharedScripts")}
            </TabsTrigger>
            <TabsTrigger value="public-scripts">
              {t("publicScripts")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScriptList
              scripts={allScripts.data}
              toggleFavorite={toggleFavorite}
              loading={allScriptsListLoading}
              refetch={() => refetchAllScripts(scriptListOptions)}
            />
          </TabsContent>

          <TabsContent value="favorites">
            <ScriptList
              scripts={favoriteScripts.data}
              toggleFavorite={toggleFavorite}
              loading={favoriteScriptsListLoading}
              refetch={() => refetchFavoriteScripts(scriptListOptions)}
            />
          </TabsContent>

          <TabsContent value="shared-scripts">
            <ScriptList
              scripts={sharedScripts.data}
              toggleFavorite={toggleFavorite}
              loading={sharedScriptsListLoading}
              refetch={() => refetchSharedScripts(scriptListOptions)}
            />
          </TabsContent>

          <TabsContent value="public-scripts">
            <PublicScriptList
              toggleFavorite={toggleFavorite}
              state={publicScriptState}
              updateState={updatePublicScriptState}
              filterOptions={scriptListOptions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScriptsPage;
