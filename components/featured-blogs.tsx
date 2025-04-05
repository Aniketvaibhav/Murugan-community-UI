"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/utils/auth-redirect"

// Mock data for featured blogs
const featuredBlogs = [
  {
    id: 1,
    title: "My Pilgrimage to Palani Temple",
    excerpt: "Sharing my spiritual journey to one of the six abodes of Lord Murugan...",
    author: {
      name: "Ramesh Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RK",
    },
    date: "May 15, 2023",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Significance of Vel in Murugan Worship",
    excerpt: "Exploring the symbolism and spiritual meaning behind Lord Murugan's spear...",
    author: {
      name: "Priya Sundaram",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PS",
    },
    date: "April 28, 2023",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Celebrating Thaipusam: A Personal Account",
    excerpt: "My experience participating in the Thaipusam festival for the first time...",
    author: {
      name: "Anand Venkat",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AV",
    },
    date: "February 10, 2023",
    readTime: "6 min read",
  },
]

export function FeaturedBlogs() {
  const { isAuthenticated } = useAuth()
  const { redirectToLogin } = useAuthRedirect()

  const handleBlogClick = (e: React.MouseEvent, blogId: number) => {
    if (!isAuthenticated) {
      e.preventDefault()
      redirectToLogin("blog details")
    }
    // If authenticated, the Link will handle navigation
  }

  return (
    <div className="mt-6 space-y-6">
      {featuredBlogs.map((blog) => (
        <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-md">
          <Link href={`/blogs/${blog.id}`} onClick={(e) => handleBlogClick(e, blog.id)}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="mt-2 text-muted-foreground">{blog.excerpt}</p>
            </CardContent>
          </Link>
          <CardFooter className="border-t bg-muted/20 p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                <AvatarFallback>{blog.author.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{blog.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {blog.date} · {blog.readTime}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

