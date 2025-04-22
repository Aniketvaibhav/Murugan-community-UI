"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post/post-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types/post"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "1",
    content: "Just visited the Palani Murugan Temple. The spiritual energy there is incredible! 🙏",
    media: [
      {
        id: "media-1",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: "media-2",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    author: {
      id: "1",
      name: "Ramesh Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "rameshk",
    },
    createdAt: "2023-05-15T10:30:00Z",
    likes: 42,
    comments: [
      {
        id: "comment-1",
        content: "Beautiful! I was there last month. Such a peaceful place.",
        author: {
          id: "2",
          name: "Priya Sundaram",
          avatar: "/placeholder.svg?height=40&width=40",
          username: "priyas",
        },
        createdAt: "2023-05-15T11:15:00Z",
      },
    ],
    tags: [
      {
        id: "tag-1",
        name: "PalaniTemple",
      },
      {
        id: "tag-2",
        name: "LordMurugan",
      },
    ],
  },
  {
    id: "2",
    content: "Celebrating Thaipusam with my family. The kavadi ceremony was a profound spiritual experience.",
    media: [
      {
        id: "media-3",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    author: {
      id: "3",
      name: "Anand Venkat",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "anandv",
    },
    createdAt: "2023-02-10T08:45:00Z",
    likes: 56,
    comments: [
      {
        id: "comment-2",
        content: "The devotion during Thaipusam is always inspiring!",
        author: {
          id: "4",
          name: "Lakshmi Narayanan",
          avatar: "/placeholder.svg?height=40&width=40",
          username: "lakshminarayanan",
        },
        createdAt: "2023-02-10T09:30:00Z",
      },
    ],
    tags: [
      {
        id: "tag-3",
        name: "Thaipusam",
      },
      {
        id: "tag-4",
        name: "Festival",
      },
    ],
  },
  {
    id: "3",
    content: "Morning prayers at the Thiruchendur temple. Starting the day with divine blessings.",
    media: [
      {
        id: "media-4",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    author: {
      id: "5",
      name: "Karthik Raja",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "karthikr",
    },
    createdAt: "2023-06-20T06:15:00Z",
    likes: 35,
    comments: [],
    tags: [
      {
        id: "tag-5",
        name: "Thiruchendur",
      },
      {
        id: "tag-6",
        name: "MorningPrayers",
      },
    ],
  },
]

interface PostFeedProps {
  userOnly?: boolean
  username?: string
}

export function PostFeed({ userOnly = false, username }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState("recent")
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch posts from an API
    setTimeout(() => {
      let filteredPosts = [...mockPosts]

      if (userOnly && username) {
        filteredPosts = filteredPosts.filter((post) => post.author.username === username)
      }

      if (activeTab === "popular") {
        filteredPosts.sort((a, b) => b.likes - a.likes)
      } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setPosts(filteredPosts)
      setLoading(false)
      setHasMore(false) // For mock data, we don't have more pages
    }, 1000)
  }, [userOnly, username, activeTab])

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    })
  }

  const loadMore = () => {
    setPage(page + 1)
    // In a real app, this would fetch the next page of posts
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">No posts found</h3>
        <p className="text-muted-foreground">
          {userOnly ? "You haven't created any posts yet." : "There are no posts to display."}
        </p>
        {userOnly && (
          <Button className="mt-4" asChild>
            <a href="/posts/create">Create Your First Post</a>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!userOnly && (
        <Tabs defaultValue="recent" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
