"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, BookOpen, FileText, Mic, UserPlus } from "lucide-react"
import { PostFeed } from "@/components/post/post-feed"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Mock user profile data
const mockUserProfile = {
  id: "1",
  name: "Ramesh Kumar",
  username: "rameshk",
  avatar: "/placeholder.svg?height=128&width=128",
  coverImage: "/placeholder.svg?height=300&width=1200",
  bio: "Devoted follower of Lord Murugan. Passionate about sharing spiritual experiences and connecting with fellow devotees.",
  location: "Chennai, Tamil Nadu",
  joinedDate: "Joined January 2023",
  followers: 245,
  following: 132,
  posts: 37,
  isFollowing: false,
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<typeof mockUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch the user profile from an API
    setTimeout(() => {
      setProfile(mockUserProfile)
      setIsFollowing(mockUserProfile.isFollowing)
      setIsLoading(false)
    }, 1000)
  }, [username])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You have unfollowed ${profile?.name}` : `You are now following ${profile?.name}`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="relative h-48 w-full sm:h-64 md:h-80">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container relative -mt-20 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-end sm:space-x-6 sm:space-y-0">
            <Skeleton className="h-32 w-32 rounded-full sm:h-40 sm:w-40" />
            <div className="flex flex-1 flex-col space-y-2 text-center sm:text-left">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Cover Image */}
      <div className="relative h-48 w-full sm:h-64 md:h-80">
        <Image src={profile.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" priority />
      </div>

      {/* Profile Info */}
      <div className="container relative -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-end sm:space-x-6 sm:space-y-0">
          <Avatar className="h-32 w-32 border-4 border-background sm:h-40 sm:w-40">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold sm:text-3xl">{profile.name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
          <Button variant={isFollowing ? "outline" : "default"} size="sm" className="gap-1" onClick={handleFollow}>
            <UserPlus className="h-4 w-4" />
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">About</h3>
                  <p className="mt-2 text-sm">{profile.bio}</p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {profile.joinedDate}
                  </div>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{profile.followers}</p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{profile.following}</p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{profile.posts}</p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="blogs" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Blogs
                </TabsTrigger>
                <TabsTrigger value="voice-rooms" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Rooms
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-0">
                <PostFeed userOnly username={profile.username} />
              </TabsContent>

              <TabsContent value="blogs" className="mt-0">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                  <h3 className="text-lg font-medium">No blogs found</h3>
                  <p className="text-muted-foreground">{profile.name} hasn't published any blogs yet.</p>
                </div>
              </TabsContent>

              <TabsContent value="voice-rooms" className="mt-0">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                  <h3 className="text-lg font-medium">No voice rooms found</h3>
                  <p className="text-muted-foreground">{profile.name} hasn't hosted any voice rooms yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

