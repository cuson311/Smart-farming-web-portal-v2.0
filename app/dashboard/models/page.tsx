"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Database, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ModelsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newModel, setNewModel] = useState({
    name: "",
    description: "",
    tags: "",
  })

  const models = [
    {
      id: "1",
      name: "Drought Resistant Model",
      description: "Optimized for water conservation during drought conditions",
      lastUpdated: "1 day ago",
      tags: ["drought", "conservation"],
      versions: 3,
    },
    {
      id: "2",
      name: "Seasonal Adjustment Model",
      description: "Adjusts irrigation based on seasonal changes",
      lastUpdated: "3 days ago",
      tags: ["seasonal", "adjustment"],
      versions: 2,
    },
    {
      id: "3",
      name: "Crop-Specific Model",
      description: "Tailored irrigation for specific crop types",
      lastUpdated: "1 week ago",
      tags: ["crop", "specific"],
      versions: 4,
    },
    {
      id: "4",
      name: "Weather Responsive Model",
      description: "Adapts to changing weather conditions",
      lastUpdated: "2 weeks ago",
      tags: ["weather", "adaptive"],
      versions: 5,
    },
    {
      id: "5",
      name: "Soil Type Model",
      description: "Optimized for different soil types and conditions",
      lastUpdated: "3 weeks ago",
      tags: ["soil", "optimization"],
      versions: 2,
    },
    {
      id: "6",
      name: "Water Efficiency Model",
      description: "Maximizes water efficiency across all conditions",
      lastUpdated: "1 month ago",
      tags: ["efficiency", "water"],
      versions: 3,
    },
  ]

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleNewModelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewModel((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateModel = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Model created",
      description: `Model "${newModel.name}" has been created successfully.`,
    })
    setNewModel({ name: "", description: "", tags: "" })
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Models</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search models..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Model
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Model</DialogTitle>
                <DialogDescription>Add a new irrigation model to your collection.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateModel}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={newModel.name} onChange={handleNewModelChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newModel.description}
                      onChange={handleNewModelChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={newModel.tags}
                      onChange={handleNewModelChange}
                      placeholder="e.g. drought, efficiency, seasonal"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Model</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="recent">Recently Updated</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <Card key={model.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {model.name}
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Updated {model.lastUpdated}</span>
                    <span>•</span>
                    <span>{model.versions} versions</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/models/${model.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels
              .slice()
              .sort((a, b) => {
                // Simple sort by "lastUpdated" string for demo purposes
                return a.lastUpdated.localeCompare(b.lastUpdated)
              })
              .slice(0, 3)
              .map((model) => (
                <Card key={model.id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {model.name}
                      </CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Updated {model.lastUpdated}</span>
                      <span>•</span>
                      <span>{model.versions} versions</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/models/${model.id}`}>View</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

