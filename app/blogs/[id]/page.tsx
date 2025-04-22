"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BlogDetail } from "@/components/blog/blog-detail"
import { Skeleton } from "@/components/ui/skeleton"

// Mock blog data - in a real app, this would come from an API
const mockBlog = {
  id: "1",
  title: "My Pilgrimage to Palani Temple",
  content: `I recently had the privilege of visiting the sacred Palani Murugan Temple, one of the six abodes of Lord Murugan. The journey was both physically challenging and spiritually rewarding.

The temple is situated atop a hill, and climbing the 690 steps to reach it is considered a form of penance. Many devotees choose to carry kavadi (a decorative arch) as they ascend, symbolizing the burden of their sins that they wish to leave behind.

As I climbed, I could feel the spiritual energy growing stronger with each step. The view from the top was breathtaking, both literally and figuratively. The temple itself is a masterpiece of Dravidian architecture, with intricate carvings and a powerful presence.

Inside, the idol of Lord Murugan, known as Dandayudhapani (Lord with a Staff), is made of a unique combination of nine herbs or navapashanam. It's said to have medicinal properties, and the abhishekam (sacred bath) mixture is distributed as prasadam to devotees.

The moment I stood before the deity, I felt a profound sense of peace and connection. The rituals performed by the priests were mesmerizing, and the sound of the temple bells created an atmosphere of divine communion.

I spent several hours in meditation and prayer, feeling blessed to be in this sacred space. The experience has deepened my devotion to Lord Murugan and strengthened my spiritual practice.

If you ever have the opportunity to visit Palani, I highly recommend making the pilgrimage. The physical effort is well worth the spiritual rewards that await at the summit.`,
  category: "Pilgrimage",
  date: "May 15, 2023",
  author: {
    id: "1",
    name: "Ramesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RK",
  },
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
  likes: 42,
  comments: [
    {
      id: "comment-1",
      author: {
        id: "2",
        name: "Priya Sundaram",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "PS",
      },
      content:
        "Beautiful description! I visited Palani last year and had a similar experience. The energy there is truly special.",
      date: "May 16, 2023",
    },
    {
      id: "comment-2",
      author: {
        id: "3",
        name: "Anand Venkat",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AV",
      },
      content:
        "Thank you for sharing your spiritual journey. I'm planning to visit next month. Any tips for first-time visitors?",
      date: "May 17, 2023",
    },
  ],
}

export default function BlogPage() {
  const params = useParams()
  const [blog, setBlog] = useState<typeof mockBlog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the blog from an API
    setTimeout(() => {
      setBlog(mockBlog)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-64" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold">Blog not found</h1>
          <p className="text-muted-foreground">The blog you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <BlogDetail {...blog} />
      </div>
    </div>
  )
}
