import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Settings, Users, Mic, BookOpen, MapPin, Calendar, FileText, PlusCircle } from "lucide-react"
import { PostFeed } from "@/components/post/post-feed"

// Mock user data
const user = {
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
}

// Mock user content
const userBlogs = [
  {
    id: 1,
    title: "My Pilgrimage to Palani Temple",
    excerpt: "Sharing my spiritual journey to one of the six abodes of Lord Murugan...",
    date: "May 15, 2023",
    likes: 42,
    comments: 12,
  },
  {
    id: 2,
    title: "The Divine Experience at Thiruchendur",
    excerpt: "My visit to the coastal temple of Lord Murugan and the spiritual awakening I experienced...",
    date: "June 28, 2023",
    likes: 38,
    comments: 9,
  },
  {
    id: 3,
    title: "Celebrating Thaipusam: A Personal Account",
    excerpt: "My experience participating in the Thaipusam festival for the first time...",
    date: "February 10, 2023",
    likes: 56,
    comments: 15,
  },
]

const userVoiceRooms = [
  {
    id: 1,
    title: "Morning Prayer Session",
    participants: 12,
    date: "Hosted on June 15, 2023",
    isRecurring: true,
  },
  {
    id: 2,
    title: "Discussion: Skanda Purana",
    participants: 8,
    date: "Hosted on July 5, 2023",
    isRecurring: false,
  },
]

export default function ProfilePage() {
  return (
    <div className="flex flex-col">
      {/* Cover Image */}
      <div className="relative h-48 w-full sm:h-64 md:h-80">
        <Image src={user.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" priority />
      </div>

      {/* Profile Info */}
      <div className="container relative -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-end sm:space-x-6 sm:space-y-0">
          <Avatar className="h-32 w-32 border-4 border-background sm:h-40 sm:w-40">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm">{user.bio}</p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {user.joinedDate}
                  </div>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{user.followers}</p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{user.following}</p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{user.posts}</p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                </div>
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
                <PostFeed userOnly username={user.username} />
              </TabsContent>

              <TabsContent value="blogs" className="mt-0 space-y-4">
                {userBlogs.map((blog) => (
                  <Card key={blog.id}>
                    <CardContent className="p-6">
                      <Link href={`/blogs/${blog.id}`}>
                        <h3 className="text-xl font-semibold hover:text-primary">{blog.title}</h3>
                      </Link>
                      <p className="mt-2 text-muted-foreground">{blog.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{blog.date}</span>
                        <div className="flex items-center space-x-4">
                          <span>{blog.likes} likes</span>
                          <span>{blog.comments} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

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

