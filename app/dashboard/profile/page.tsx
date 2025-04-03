"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Github, Globe, Linkedin, Twitter } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    username: "johndoe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    bio: "Irrigation specialist with 5 years of experience in automated systems.",
    website: "https://example.com",
    github: "johndoe",
    twitter: "johndoe",
    linkedin: "johndoe",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="grid flex-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" value={profile.username} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={profile.fullName} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows={4} />
                </div>
                <div className="grid gap-4">
                  <Label>Social Links</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Input name="website" placeholder="Website" value={profile.website} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Input name="github" placeholder="GitHub" value={profile.github} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      <Input name="twitter" placeholder="Twitter" value={profile.twitter} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      <Input name="linkedin" placeholder="LinkedIn" value={profile.linkedin} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Your recent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">
                        You {i % 2 === 0 ? "updated" : "created"} a {i % 3 === 0 ? "script" : "model"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {i} {i === 1 ? "hour" : "hours"} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Script updates", "Model changes", "Comments", "System notifications"].map((notification, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">{notification}</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when {notification.toLowerCase()} occur
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      Push
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

