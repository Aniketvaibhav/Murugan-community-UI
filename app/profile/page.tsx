"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { format } from "date-fns"
import { Loader2, Edit, Settings, Users, Mic, BookOpen, MapPin, Calendar, FileText, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PostFeed } from "@/components/post/post-feed"
import { FollowersList } from "@/components/profile/followers-list"
import { useAuth } from "@/contexts/auth-context"
import { getApiUrl } from "@/config"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogFeed } from "@/components/blog/blog-feed"
import type { Blog } from "@/types/blog"

// API configuration
const API_URL = `${getApiUrl()}/api`
const API_BASE_URL = API_URL.replace('/api', '') // Remove /api for media URLs

// Type definitions for data structures
type UserData = {
  _id: string
  name: string
  username: string
  avatar: string
  coverImage: string
  bio: string
  location: string
  createdAt: string
  followers: number
  following: number
  posts: number
}

type VoiceRoom = {
  id: string
  title: string
  participants: number
  date: string
  isRecurring: boolean
}

export default function ProfilePage() {
  // Auth and routing hooks
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  // State management
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userBlogs, setUserBlogs] = useState<Blog[]>([])
  const [userVoiceRooms, setUserVoiceRooms] = useState<VoiceRoom[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch user data and related content
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true); // Reset loading state when refetching
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Fetch user profile data
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profileData = response.data.data.user;
        
        setUserData({
          _id: profileData._id,
          name: profileData.name,
          username: profileData.username,
          avatar: profileData.avatar ? `${API_BASE_URL}${profileData.avatar}` : "/placeholder.svg",
          coverImage: profileData.coverImage ? `${API_BASE_URL}${profileData.coverImage}` : "/placeholder.svg",
          bio: profileData.bio || "Welcome to my profile!",
          location: profileData.location || "Not specified",
          createdAt: profileData.createdAt,
          followers: profileData.followers || 0,
          following: profileData.following || 0,
          posts: profileData.posts || 0
        });
        
        // Fetch additional user content
        await Promise.all([
          // Fetch blogs
          axios.get(`${API_URL}/blogs/user/${profileData.username}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => setUserBlogs(
              res.data.data.blogs.map((blog: any) => ({
                ...blog,
                media: blog.media?.map((m: any) => ({
                  ...m,
                  url: m.url?.startsWith('http') ? m.url : `${API_BASE_URL}${m.url}`,
                })) || [],
                author: {
                  ...blog.author,
                  avatar: blog.author.avatar?.startsWith('http')
                    ? blog.author.avatar
                    : `${API_BASE_URL}${blog.author.avatar}`,
                },
                content: blog.content || "",
                image: blog.image || "",
                createdAt: blog.createdAt || "",
                updatedAt: blog.updatedAt || "",
              }))
            ))
            .catch(() => setUserBlogs([])),
          
          // Fetch voice rooms
          axios.get(`${API_URL}/voice-rooms/user/${profileData._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => setUserVoiceRooms(res.data.data.rooms))
            .catch(() => setUserVoiceRooms([]))
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Only redirect for auth errors
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status || 0)) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, router, user]) // Add user to dependencies

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Error loading profile</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Cover Image Section */}
      <div className="relative h-48 w-full sm:h-64 md:h-80">
        <Image 
          src={userData.coverImage || "/placeholder.svg"} 
          alt="Cover" 
          fill 
          className="object-cover" 
          priority 
        />
      </div>

      {/* Main Profile Content */}
      <div className="container relative -mt-20 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-end sm:space-x-6 sm:space-y-0">
          <Avatar className="h-32 w-32 border-4 border-background sm:h-40 sm:w-40">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold sm:text-3xl">{userData.name}</h1>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <Link href="/profile/edit">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm">{userData.bio}</p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {userData.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {`Joined ${format(new Date(userData.createdAt), 'MMMM yyyy')}`}
                  </div>
                </div>
                {/* User Stats */}
                <div className="flex justify-between pt-2 text-sm">
                  <div className="text-center">
                    <p className="font-medium">
                      <FollowersList count={userData.followers} type="followers" username={userData.username} />
                    </p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      <FollowersList count={userData.following} type="following" username={userData.username} />
                    </p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{userData.posts}</p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="/posts/create">
                      <PlusCircle className="h-4 w-4" />
                      Create New Post
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="/profile/blogs">
                      <FileText className="h-4 w-4" />
                      Manage Your Blogs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
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

              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-0">
                <PostFeed userOnly username={userData.username} />
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs" className="mt-0">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                  {userBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </TabsContent>

              {/* Voice Rooms Tab */}
              <TabsContent value="voice-rooms" className="mt-0 space-y-4">
                {userVoiceRooms.map((room) => (
                  <Card key={room.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-medium">{room.title}</h3>
                            {room.isRecurring && (
                              <Badge variant="outline" className="border-primary text-primary">
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{room.participants} participants</span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">{room.date}</div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/voice-rooms/${room.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
