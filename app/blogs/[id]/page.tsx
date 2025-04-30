"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BlogDetail } from "@/components/blog/blog-detail"
import { Skeleton } from "@/components/ui/skeleton"
import { getBlog } from "@/lib/api/blog"
import type { Blog } from "@/types/blog"

export default function BlogPage() {
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await getBlog(params.id as string)
        setBlog(response.data.blog)
      } catch (error) {
        setBlog(null)
      } finally {
        setIsLoading(false)
      }
    }
    if (params.id) fetchBlog()
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
        <BlogDetail
          {...blog}
          date={new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          author={{
            ...blog.author,
            initials: blog.author.name
              ? blog.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : ''
          }}
          comments={blog.comments.map(comment => ({
            ...comment,
            date: new Date(comment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            author: {
              ...comment.author,
              initials: comment.author.name
                ? comment.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : ''
            }
          }))}
        />
      </div>
    </div>
  )
}
