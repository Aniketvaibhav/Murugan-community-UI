"use client"

import type React from "react"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/utils/auth-redirect"
import { ExpandableCard } from "@/components/ui/aceternity/expandable-card"

// Mock data for featured blogs
const featuredBlogs = [
  {
    id: 1,
    title: "My Pilgrimage to Palani Temple",
    excerpt: "Sharing my spiritual journey to one of the six abodes of Lord Murugan...",
    content: `I recently had the privilege of visiting the sacred Palani Murugan Temple, one of the six abodes of Lord Murugan. The journey was both physically challenging and spiritually rewarding.

The temple is situated atop a hill, and climbing the 690 steps to reach it is considered a form of penance. Many devotees choose to carry kavadi (a decorative arch) as they ascend, symbolizing the burden of their sins that they wish to leave behind.

As I climbed, I could feel the spiritual energy growing stronger with each step. The view from the top was breathtaking, both literally and figuratively. The temple itself is a masterpiece of Dravidian architecture, with intricate carvings and a powerful presence.`,
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
    content: `The Vel, Lord Murugan's divine spear, is one of the most significant symbols in His worship. This powerful weapon represents divine wisdom that pierces through ignorance and spiritual darkness.

According to mythology, the Vel was given to Lord Murugan by His mother, Goddess Parvati, to vanquish the demon Soorapadman. The Vel represents the power of knowledge and discrimination that helps devotees overcome their inner demons of ego, anger, and attachment.

In temples dedicated to Lord Murugan, the Vel is often placed next to the main deity and is itself worshipped. Many devotees also keep small Vel symbols in their homes as a protective talisman.`,
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
    content: `Thaipusam is one of the most important festivals dedicated to Lord Murugan, and this year I had the opportunity to participate in the celebrations for the first time. The experience was nothing short of transformative.

The festival commemorates the occasion when Goddess Parvati gave Lord Murugan the Vel to vanquish the demon Soorapadman. Devotees prepare for weeks before the festival through fasting, prayer, and other austerities.

On the day of Thaipusam, I joined thousands of devotees in a procession carrying kavadis (decorated frames) as offerings to Lord Murugan. The atmosphere was electric with devotion - the air filled with chants, music, and the scent of camphor and incense.`,
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
        <ExpandableCard
          key={blog.id}
          className="hover:border-primary/50 transition-all duration-300"
          expandedClassName="border-primary shadow-lg"
          cardTitle={blog.title}
          cardDescription={blog.excerpt}
          cardContent={
            <div className="space-y-4 pt-2">
              <p className="text-foreground/90 whitespace-pre-line">{blog.content}</p>
              <div className="flex items-center justify-between pt-4 border-t">
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
                <Button size="sm" onClick={(e) => handleBlogClick(e, blog.id)} asChild>
                  <Link href={`/blogs/${blog.id}`}>Read Full Article</Link>
                </Button>
              </div>
            </div>
          }
        />
      ))}
    </div>
  )
}
