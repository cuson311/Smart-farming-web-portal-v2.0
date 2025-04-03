import Link from "next/link"
import { Code2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentScripts() {
  const scripts = [
    {
      id: "1",
      name: "Daily Irrigation Schedule",
      description: "Automated daily irrigation based on soil moisture",
      lastUpdated: "2 hours ago",
      favorite: true,
    },
    {
      id: "2",
      name: "Weather-based Irrigation",
      description: "Adjusts irrigation based on weather forecast",
      lastUpdated: "1 day ago",
      favorite: true,
    },
    {
      id: "3",
      name: "Seasonal Adjustment",
      description: "Seasonal adjustments for irrigation schedules",
      lastUpdated: "3 days ago",
      favorite: false,
    },
    {
      id: "4",
      name: "Zone Control Script",
      description: "Controls different irrigation zones separately",
      lastUpdated: "1 week ago",
      favorite: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {scripts.map((script) => (
        <Card
          key={script.id}
          className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-irrigation-500" />
                {script.name}
              </CardTitle>
              <CardDescription>{script.description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className={script.favorite ? "fill-yellow-400 text-yellow-400" : ""} size={16} />
              <span className="sr-only">Favorite</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Updated {script.lastUpdated}</span>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-irrigation-600 hover:text-irrigation-700 hover:bg-irrigation-50 dark:text-irrigation-400 dark:hover:text-irrigation-300 dark:hover:bg-irrigation-900/50"
              >
                <Link href={`/dashboard/scripts/${script.id}`}>View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

