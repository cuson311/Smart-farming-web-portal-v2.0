import { Code2, Database, Droplets, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentScripts } from "@/components/recent-scripts"
import { ActivityLog } from "@/components/activity-log"

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your irrigation management dashboard.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scripts</CardTitle>
            <Code2 className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Database className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">12</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
            <Droplets className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">28%</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="recent" className="bg-background rounded-lg border p-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Scripts</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="border-none p-4 pt-6">
          <RecentScripts />
        </TabsContent>
        <TabsContent value="activity" className="border-none p-4 pt-6">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}

