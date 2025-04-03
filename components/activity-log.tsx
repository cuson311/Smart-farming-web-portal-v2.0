import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityLog() {
  const activities = [
    {
      id: "1",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
      action: "updated script",
      target: "Daily Irrigation Schedule",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      action: "created model",
      target: "Drought Resistant Model",
      time: "5 hours ago",
    },
    {
      id: "3",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MJ",
      },
      action: "commented on",
      target: "Weather-based Irrigation",
      time: "1 day ago",
    },
    {
      id: "4",
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SW",
      },
      action: "compared versions of",
      target: "Zone Control Script",
      time: "2 days ago",
    },
  ]

  return (
    <Card className="border-irrigation-200 dark:border-irrigation-800">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your team's latest actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
            <Avatar className="h-8 w-8 border-2 border-irrigation-200 dark:border-irrigation-800">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-irrigation-100 text-irrigation-800 dark:bg-irrigation-900 dark:text-irrigation-300">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                <span className="font-semibold text-irrigation-600 dark:text-irrigation-400">{activity.target}</span>
              </p>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

