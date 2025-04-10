import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useFetchActivities } from "@/hooks/useFetchUser";
import { UserActivity } from "@/types/user";
import Pagination from "@/components/ui/pagination";

// Number of activity months to display per page
const ITEMS_PER_PAGE = 1;

// Maximum number of items to show per activity type
const MAX_ITEMS_TO_DISPLAY = 3;

type ActivityItem = {
  _id: string;
  type: "script" | "model" | "comment";
  action: "create";
  name?: string;
  content?: string;
  script_id?: {
    _id: string;
    name: string;
  };
  timestamp: Date;
};

type GroupedActivities = {
  [key: string]: ActivityItem[];
};

const processActivityData = (activitiesData: UserActivity[]) => {
  const formattedActivities = [] as ActivityItem[];

  Object.entries(activitiesData).forEach(([yearMonth, actions]) => {
    const [year, month] = yearMonth.split("-").map(Number);
    // Create a timestamp for the month
    const monthTimestamp = new Date(year, month - 1, 15);

    // Process script creations
    if (actions.create_script && Array.isArray(actions.create_script)) {
      actions.create_script.forEach((script) => {
        formattedActivities.push({
          _id: script._id,
          type: "script",
          action: "create",
          name: script.name,
          timestamp: monthTimestamp,
        });
      });
    }

    // Process model creations
    if (actions.create_model && Array.isArray(actions.create_model)) {
      actions.create_model.forEach((model) => {
        formattedActivities.push({
          _id: model._id,
          type: "model",
          action: "create",
          name: model.name,
          timestamp: monthTimestamp,
        });
      });
    }

    // Process comment creations
    if (actions.create_comment && Array.isArray(actions.create_comment)) {
      actions.create_comment.forEach((comment) => {
        formattedActivities.push({
          _id: comment._id,
          type: "comment",
          action: "create",
          content: comment.content,
          script_id: comment.script_id,
          timestamp: monthTimestamp,
        });
      });
    }
  });

  // Sort by timestamp, newest first
  formattedActivities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Group by month-year
  const groupedActivities: GroupedActivities = {};

  formattedActivities.forEach((activity) => {
    const monthYearKey = format(activity.timestamp, "MMMM yyyy");
    if (!groupedActivities[monthYearKey]) {
      groupedActivities[monthYearKey] = [];
    }
    groupedActivities[monthYearKey].push(activity);
  });

  return groupedActivities;
};

const ActivitySection = () => {
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const { userId } = useParams() as { userId: string };
  const [curYear, setCurYear] = useState(new Date().getFullYear().toString());
  const [currentPage, setCurrentPage] = useState(1);

  // Track displayed item counts for each activity type and month
  const [displayCounts, setDisplayCounts] = useState<{
    [key: string]: { scripts: number; models: number; comments: number };
  }>({});

  const {
    data: activitiesData,
    loading: activitiesLoading,
    error: activitiesError,
  } = useFetchActivities(userId, curYear);

  useEffect(() => {
    if (!activitiesLoading && activitiesData) {
      try {
        const processedActivities = processActivityData(activitiesData);
        setGroupedActivities(processedActivities);

        // Initialize display counts for all months
        const initialDisplayCounts: {
          [key: string]: {
            scripts: number;
            models: number;
            comments: number;
          };
        } = {};

        Object.keys(processedActivities).forEach((month) => {
          initialDisplayCounts[month] = {
            scripts: MAX_ITEMS_TO_DISPLAY,
            models: MAX_ITEMS_TO_DISPLAY,
            comments: MAX_ITEMS_TO_DISPLAY,
          };
        });

        setDisplayCounts(initialDisplayCounts);
      } catch (error) {
        console.error("Failed to process activity data:", error);
      }
      setLoading(false);
    }
  }, [activitiesData, activitiesLoading]);

  // Show more items for a specific activity type in a specific month
  const showMore = (month: string, type: "scripts" | "models" | "comments") => {
    setDisplayCounts((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [type]: prev[month][type] + MAX_ITEMS_TO_DISPLAY,
      },
    }));
  };

  // Show fewer items (reset to default display count)
  const showLess = (month: string, type: "scripts" | "models" | "comments") => {
    setDisplayCounts((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [type]: MAX_ITEMS_TO_DISPLAY,
      },
    }));
  };

  // Function to get appropriate icon and color for each activity type
  const getActivityStyle = (type: string) => {
    switch (type) {
      case "script":
        return {
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-600 dark:text-blue-400",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600 dark:text-blue-400"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          ),
        };
      case "model":
        return {
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-600 dark:text-purple-400",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600 dark:text-purple-400"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          ),
        };
      case "comment":
        return {
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-600 dark:text-green-400",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600 dark:text-green-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
        };
      default:
        return {
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-600 dark:text-gray-400",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 dark:text-gray-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ),
        };
    }
  };

  // Count activities by type for each month
  const getActivityCounts = (activities: ActivityItem[]) => {
    const counts = {
      script: 0,
      model: 0,
      comment: 0,
    };

    activities.forEach((activity) => {
      counts[activity.type] += 1;
    });

    return counts;
  };

  // Helper to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Calculate pagination
  const activityMonths = Object.keys(groupedActivities);
  const totalPages = Math.ceil(activityMonths.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMonths = activityMonths.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Loading activities...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (Object.keys(groupedActivities).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Activities by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            No activities found for {curYear}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, activityMonths.length)} of {activityMonths.length}{" "}
          activity months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentMonths.map((monthYear) => {
            const activities = groupedActivities[monthYear];
            const counts = getActivityCounts(activities);
            const monthDisplayCount = displayCounts[monthYear] || {
              scripts: MAX_ITEMS_TO_DISPLAY,
              models: MAX_ITEMS_TO_DISPLAY,
              comments: MAX_ITEMS_TO_DISPLAY,
            };

            // Get limited items based on display count
            const scriptItems = activities
              .filter((a) => a.type === "script")
              .slice(0, monthDisplayCount.scripts);

            const modelItems = activities
              .filter((a) => a.type === "model")
              .slice(0, monthDisplayCount.models);

            const commentItems = activities
              .filter((a) => a.type === "comment")
              .slice(0, monthDisplayCount.comments);

            // Count total items of each type
            const totalScripts = activities.filter(
              (a) => a.type === "script"
            ).length;
            const totalModels = activities.filter(
              (a) => a.type === "model"
            ).length;
            const totalComments = activities.filter(
              (a) => a.type === "comment"
            ).length;

            return (
              <div key={monthYear} className="rounded-lg border p-4">
                <h3 className="mb-3 text-lg font-medium">{monthYear}</h3>
                <div className="space-y-3">
                  {/* Activity type summary */}
                  <div className="flex flex-wrap gap-2">
                    {counts.script > 0 && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-600 dark:text-blue-400">
                        <span>{counts.script} Scripts</span>
                      </div>
                    )}
                    {counts.model > 0 && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs text-purple-600 dark:text-purple-400">
                        <span>{counts.model} Models</span>
                      </div>
                    )}
                    {counts.comment > 0 && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs text-green-600 dark:text-green-400">
                        <span>{counts.comment} Comments</span>
                      </div>
                    )}
                  </div>

                  {/* Activity list with expandable sections */}
                  <div className="space-y-3">
                    {counts.script > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {getActivityStyle("script").icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Scripts</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {scriptItems.map((activity) => (
                              <span
                                key={activity._id}
                                className="inline-block rounded bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs"
                              >
                                {activity.name}
                              </span>
                            ))}

                            {totalScripts > monthDisplayCount.scripts ? (
                              <button
                                onClick={() => showMore(monthYear, "scripts")}
                                className="inline-block rounded bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 text-xs transition-colors cursor-pointer"
                              >
                                +
                                {Math.min(
                                  MAX_ITEMS_TO_DISPLAY,
                                  totalScripts - monthDisplayCount.scripts
                                )}{" "}
                                more
                              </button>
                            ) : monthDisplayCount.scripts >
                              MAX_ITEMS_TO_DISPLAY ? (
                              <button
                                onClick={() => showLess(monthYear, "scripts")}
                                className="inline-block rounded bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 text-xs transition-colors cursor-pointer"
                              >
                                Show less
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {counts.model > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          {getActivityStyle("model").icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Models</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {modelItems.map((activity) => (
                              <span
                                key={activity._id}
                                className="inline-block rounded bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs"
                              >
                                {activity.name}
                              </span>
                            ))}

                            {totalModels > monthDisplayCount.models ? (
                              <button
                                onClick={() => showMore(monthYear, "models")}
                                className="inline-block rounded bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-2 py-1 text-xs transition-colors cursor-pointer"
                              >
                                +
                                {Math.min(
                                  MAX_ITEMS_TO_DISPLAY,
                                  totalModels - monthDisplayCount.models
                                )}{" "}
                                more
                              </button>
                            ) : monthDisplayCount.models >
                              MAX_ITEMS_TO_DISPLAY ? (
                              <button
                                onClick={() => showLess(monthYear, "models")}
                                className="inline-block rounded bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-2 py-1 text-xs transition-colors cursor-pointer"
                              >
                                Show less
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {counts.comment > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          {getActivityStyle("comment").icon}
                        </div>
                        <div className="w-full">
                          <p className="text-sm font-medium mb-2">Comments</p>
                          <div className="space-y-2">
                            {commentItems.map((activity) => (
                              <div
                                key={activity._id}
                                className="rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-2"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium text-primary">
                                    {activity.script_id?.name}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {truncateText(activity.content || "", 100)}
                                </p>
                              </div>
                            ))}

                            {totalComments > monthDisplayCount.comments ? (
                              <button
                                onClick={() => showMore(monthYear, "comments")}
                                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mt-1 flex items-center transition-colors cursor-pointer"
                              >
                                Show{" "}
                                {Math.min(
                                  MAX_ITEMS_TO_DISPLAY,
                                  totalComments - monthDisplayCount.comments
                                )}{" "}
                                more comments
                              </button>
                            ) : monthDisplayCount.comments >
                              MAX_ITEMS_TO_DISPLAY ? (
                              <button
                                onClick={() => showLess(monthYear, "comments")}
                                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mt-1 flex items-center transition-colors cursor-pointer"
                              >
                                Show less comments
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex justify-center border-t pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ActivitySection;
