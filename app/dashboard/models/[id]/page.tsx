"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Code2, Database, Tag, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [activeVersion, setActiveVersion] = useState("v1.2")

  const model = {
    id: params.id,
    name: "Drought Resistant Model",
    description: "Optimized for water conservation during drought conditions",
    createdAt: "2023-09-10",
    updatedAt: "2023-11-15",
    tags: ["drought", "conservation", "efficiency"],
    versions: [
      { version: "v1.2", date: "2023-11-15", author: "John Doe" },
      { version: "v1.1", date: "2023-10-20", author: "John Doe" },
      { version: "v1.0", date: "2023-09-10", author: "John Doe" },
    ],
    scripts: [
      {
        id: "1",
        name: "Water Conservation Mode",
        description: "Optimizes water usage during drought conditions",
        lastUpdated: "2 days ago",
      },
      {
        id: "2",
        name: "Soil Moisture Monitoring",
        description: "Monitors soil moisture levels and adjusts irrigation",
        lastUpdated: "1 week ago",
      },
      {
        id: "3",
        name: "Seasonal Adjustment",
        description: "Seasonal adjustments for irrigation schedules",
        lastUpdated: "2 weeks ago",
      },
    ],
    schedules: [
      {
        id: "1",
        name: "Daily Generation",
        frequency: "Daily at 6:00 AM",
        lastRun: "Today at 6:00 AM",
        nextRun: "Tomorrow at 6:00 AM",
        status: "Active",
      },
      {
        id: "2",
        name: "Weekly Report",
        frequency: "Weekly on Sunday at 12:00 AM",
        lastRun: "Nov 12, 2023",
        nextRun: "Nov 19, 2023",
        status: "Active",
      },
    ],
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/models">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{model.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scripts">Scripts</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="schedules">Schedules</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Model Overview
                  </CardTitle>
                  <CardDescription>Details about the {model.name} model</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Description</h3>
                    <p className="text-muted-foreground">{model.description}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-sm font-medium">Created</h3>
                      <p className="text-muted-foreground">{model.createdAt}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-medium">Last Updated</h3>
                      <p className="text-muted-foreground">{model.updatedAt}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Versions</h3>
                    <p className="text-muted-foreground">
                      This model has {model.versions.length} versions, with the latest being {model.versions[0].version}{" "}
                      released on {model.versions[0].date}.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Associated Scripts</h3>
                    <p className="text-muted-foreground">This model is used by {model.scripts.length} scripts.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scripts" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Associated Scripts
                  </CardTitle>
                  <CardDescription>Scripts that use this model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {model.scripts.map((script) => (
                      <div key={script.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{script.name}</p>
                          <p className="text-sm text-muted-foreground">{script.description}</p>
                          <p className="text-xs text-muted-foreground">Updated {script.lastUpdated}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/scripts/${script.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="versions" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>Compare different versions of this model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <label htmlFor="compareFrom">Compare</label>
                      <select
                        id="compareFrom"
                        className="rounded-md border p-2"
                        defaultValue={model.versions[1].version}
                      >
                        {model.versions.map((v) => (
                          <option key={v.version} value={v.version}>
                            {v.version} ({v.date})
                          </option>
                        ))}
                      </select>
                      <label htmlFor="compareTo">to</label>
                      <select id="compareTo" className="rounded-md border p-2" defaultValue={model.versions[0].version}>
                        {model.versions.map((v) => (
                          <option key={v.version} value={v.version}>
                            {v.version} ({v.date})
                          </option>
                        ))}
                      </select>
                      <Button>Compare</Button>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      {model.versions.map((version) => (
                        <div key={version.version} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{version.version}</p>
                              <p className="text-sm text-muted-foreground">
                                {version.date} by {version.author}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setActiveVersion(version.version)}>
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Restore
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedules" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Generation Schedules
                  </CardTitle>
                  <CardDescription>Scheduled script generation using this model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {model.schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{schedule.name}</p>
                          <p className="text-sm text-muted-foreground">{schedule.frequency}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Last run: {schedule.lastRun}</span>
                            <span>•</span>
                            <span>Next run: {schedule.nextRun}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              schedule.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {schedule.status}
                          </span>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Model Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button className="w-full">Edit Model</Button>
              <Button className="w-full" variant="outline">
                Generate Script
              </Button>
              <Button className="w-full" variant="outline">
                Create New Version
              </Button>
              <Button className="w-full" variant="outline">
                Export Model
              </Button>
              <Separator />
              <Button className="w-full" variant="destructive">
                Delete Model
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

