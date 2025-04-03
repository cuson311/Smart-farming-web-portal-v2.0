"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code2, Plus, Search, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFetchScriptsList } from "@/hooks/useFetchUser";

export default function ScriptsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  const { data: scripts, loading: scriptsListLoading } = useFetchScriptsList(
    userId ? userId : ""
  );

  console.log("Scripts nè", scripts);

  const filteredScripts = scripts.filter(
    (script) =>
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleNewScriptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setNewScript((prev: any) => ({ ...prev, [name]: value }))
  // }

  // const handleCreateScript = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   toast({
  //     title: "Script created",
  //     description: `Script "${newScript.name}" has been created successfully.`,
  //   })
  //   setNewScript({ name: "", description: "", code: "" })
  // }

  const toggleFavorite = (id: string) => {
    toast({
      title: "Favorite updated",
      description: "Script favorite status has been updated.",
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Scripts</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Script
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Script</DialogTitle>
                <DialogDescription>
                  Add a new irrigation script to your collection.
                </DialogDescription>
              </DialogHeader>
              {/* <form onSubmit={handleCreateScript}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={newScript.name} onChange={handleNewScriptChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newScript.description}
                      onChange={handleNewScriptChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Initial Code</Label>
                    <Textarea
                      id="code"
                      name="code"
                      value={newScript.code}
                      onChange={handleNewScriptChange}
                      className="font-mono"
                      rows={10}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Script</Button>
                </DialogFooter>
              </form> */}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Scripts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Updated</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredScripts.map((script) => (
              <Card key={script._id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      {script.name}
                    </CardTitle>
                    <CardDescription>{script.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFavorite(script._id)}
                  >
                    <Star
                      className={
                        script.favorite ? "fill-yellow-400 text-yellow-400" : ""
                      }
                      size={16}
                    />
                    <span className="sr-only">Favorite</span>
                  </Button>
                </CardHeader>
                {/* <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {script.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent> */}
                <CardFooter className="flex items-center justify-between">
                  {/* <span className="text-sm text-muted-foreground">Updated {script.lastUpdated}</span> */}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/scripts/${script._id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredScripts
              .filter((script) => script.favorite)
              .map((script) => (
                <Card key={script._id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        {script.name}
                      </CardTitle>
                      <CardDescription>{script.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(script._id)}
                    >
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={16}
                      />
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </CardHeader>
                  {/* <CardFooter className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Updated {script.lastUpdated}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/scripts/${script.id}`}>View</Link>
                    </Button>
                  </CardFooter> */}
                </Card>
              ))}
          </div>
        </TabsContent>
        {/* <TabsContent value="recent" className="border-none p-0 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredScripts
              .slice()
              .sort((a, b) => {
                // Simple sort by "lastUpdated" string for demo purposes
                return a.lastUpdated.localeCompare(b.lastUpdated)
              })
              .slice(0, 3)
              .map((script) => (
                <Card key={script.id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        {script.name}
                      </CardTitle>
                      <CardDescription>{script.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(script.id)}>
                      <Star className={script.favorite ? "fill-yellow-400 text-yellow-400" : ""} size={16} />
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {script.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Updated {script.lastUpdated}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/scripts/${script.id}`}>View</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
