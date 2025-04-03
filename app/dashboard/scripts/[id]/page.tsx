"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Code2, MessageSquare, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ScriptDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(true)
  const [activeVersion, setActiveVersion] = useState("v1.2")
  const [comment, setComment] = useState("")

  const script = {
    id: params.id,
    name: "Daily Irrigation Schedule",
    description: "Automated daily irrigation based on soil moisture",
    createdAt: "2023-10-15",
    updatedAt: "2023-11-20",
    tags: ["schedule", "automated", "daily"],
    code: `function dailyIrrigation() {
  // Get soil moisture readings
  const soilMoisture = getSoilMoistureReadings();
  
  // Check if irrigation is needed
  if (soilMoisture < MOISTURE_THRESHOLD) {
    // Calculate irrigation duration based on moisture deficit
    const duration = calculateDuration(soilMoisture);
    
    // Activate irrigation system
    activateIrrigation(duration);
    
    // Log the irrigation event
    logIrrigationEvent({
      timestamp: new Date(),
      duration: duration,
      soilMoisture: soilMoisture
    });
  }
}

// Schedule to run daily at 6:00 AM
scheduleTask('0 6 * * *', dailyIrrigation);`,
    versions: [
      { version: "v1.2", date: "2023-11-20", author: "John Doe" },
      { version: "v1.1", date: "2023-11-05", author: "John Doe" },
      { version: "v1.0", date: "2023-10-15", author: "John Doe" },
    ],
    comments: [
      {
        id: "1",
        user: {
          name: "Jane Smith",
          avatar: "/placeholder-user.jpg",
          initials: "JS",
        },
        text: "This script works great! I've been using it for a week now and it's saving me a lot of water.",
        date: "2023-11-18",
      },
      {
        id: "2",
        user: {
          name: "Mike Johnson",
          avatar: "/placeholder-user.jpg",
          initials: "MJ",
        },
        text: "Could we add a feature to adjust the moisture threshold based on the season?",
        date: "2023-11-15",
      },
    ],
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${script.name} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    })
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
      setComment("")
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/scripts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{script.name}</h1>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleFavorite}>
          <Star className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""} size={20} />
          <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Script Code
                  </CardTitle>
                  <CardDescription>
                    Current version: {activeVersion} (Last updated: {script.updatedAt})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-4 font-mono text-sm">
                    <code>{script.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="versions" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>Compare different versions of this script</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="compareFrom">Compare</Label>
                      <select
                        id="compareFrom"
                        className="rounded-md border p-2"
                        defaultValue={script.versions[1].version}
                      >
                        {script.versions.map((v) => (
                          <option key={v.version} value={v.version}>
                            {v.version} ({v.date})
                          </option>
                        ))}
                      </select>
                      <Label htmlFor="compareTo">to</Label>
                      <select
                        id="compareTo"
                        className="rounded-md border p-2"
                        defaultValue={script.versions[0].version}
                      >
                        {script.versions.map((v) => (
                          <option key={v.version} value={v.version}>
                            {v.version} ({v.date})
                          </option>
                        ))}
                      </select>
                      <Button>Compare</Button>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      {script.versions.map((version) => (
                        <div key={version.version} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Clock className="h-5 w-5 text-muted-foreground" />
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
            <TabsContent value="comments" className="border-none p-0 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </CardTitle>
                  <CardDescription>Discuss this script with your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <form onSubmit={handleCommentSubmit} className="grid gap-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button type="submit" className="ml-auto">
                        Post Comment
                      </Button>
                    </form>
                    <Separator />
                    <div className="space-y-6">
                      {script.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{comment.user.name}</span>
                              <span className="text-sm text-muted-foreground">{comment.date}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Script Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <h3 className="mb-1 text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{script.description}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground">{script.createdAt}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium">Last Updated</h3>
                <p className="text-sm text-muted-foreground">{script.updatedAt}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {script.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Edit Script
                  </Button>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    Duplicate
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

