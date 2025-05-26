"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react"
import type { Blog } from "@/types/blog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LikesModal } from "@/components/ui/likes-modal"
import { toggleLikeBlog, getBlogLikes } from "@/lib/api/blog"

interface BlogCardProps {
  blog: Blog
  onDelete?: (id: string) => void
}

export function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [likes, setLikes] = useState<string[]>(Array.isArray(blog.likes) ? blog.likes : [])
  const [likesCount, setLikesCount] = useState<number>(Array.isArray(blog.likes) ? blog.likes.length : 0)
  const [isLiked, setIsLiked] = useState(blog.isLiked || false)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likeUsers, setLikeUsers] = useState<{ id: string; username: string }[]>([])
  const { toast } = useToast()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    async function fetchLikeUsers() {
      if (likes.length === 0) {
        setLikeUsers([])
        return
      }
      const users = await Promise.all(
        likes.map(async (userId) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/users/${userId}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            return { id: userId, username: data.data.user.username }
          } catch {
            return { id: userId, username: userId }
          }
        })
      )
      setLikeUsers(users)
    }
    fetchLikeUsers()
  }, [likes])


  const handleLike = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this blog",
      })
      return
    }
    try {
      // Optimistic update
      setIsLiked((prev) => !prev)
      setLikesCount((prev) => prev + (isLiked ? -1 : 1))
      setLikes((prev) =>
        isLiked ? prev.filter((u) => u !== user.id) : [...prev, user.id]
      )
      const result = await toggleLikeBlog(blog.id, user.id)
      setLikes(result.likes)
      setLikesCount(result.likesCount)
      setIsLiked(result.liked)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like/unlike blog.",
        variant: "destructive",
      })
    }
  }

  const handleShowLikes = async () => {
    try {
      setShowLikesModal(true)
      // Optionally, fetch latest likes
      const result = await getBlogLikes(blog.id)
      setLikes(result.likes)
      setLikesCount(result.likesCount)
    } catch {}
  }

  const handleDeleteBlog = () => {
    if (onDelete) {
      onDelete(blog.id)
    }
  }

  const isAuthor = user?.id === blog.author.id
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 flex-1 flex flex-col">
        <Link href={`/blogs/${blog.id}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={blog.media[0]?.url || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                <AvatarFallback>{blog.author.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${blog.author.username}`} className="font-medium hover:underline">
                  {blog.author.name}
                </Link>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      // Placeholder for share functionality
                      toast({
                        title: "Share to...",
                        description: "Sharing options coming soon!",
                      })
                    }}
                  >
                    Share to...
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.id}`)
                      toast({
                        title: "Link copied!",
                        description: "Blog link copied to clipboard.",
                      })
                    }}
                  >
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Link href={`/blogs/${blog.id}`}>
            <h2 className="mt-4 text-xl font-semibold hover:underline line-clamp-1">{blog.title}</h2>
            <p className="mt-2 text-muted-foreground line-clamp-2">{blog.excerpt}</p>
          </Link>

          <div className="mt-4 flex items-center space-x-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {blog.category}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className={`gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike} aria-label="Like" disabled={loading}>
            <Heart className={`h-5 w-5 transition-transform duration-200 ${isLiked ? "fill-current scale-125" : "scale-100"}`} />
          </Button>
          <span className="cursor-pointer text-sm" onClick={handleShowLikes}>
            {likeUsers.length === 0
              ? "Be the first to like this"
              : likeUsers.length === 1
                ? `Liked by ${likeUsers[0].username}`
                : `Liked by ${likeUsers[0].username} and ${likeUsers.length - 1} other${likeUsers.length > 2 ? 's' : ''}`}
          </span>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-5 w-5" />
            <span>{blog.comments.length}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-5 w-5" />
          Share
        </Button>
        {/* Likes Modal */}
        <LikesModal open={showLikesModal} onClose={() => setShowLikesModal(false)} likes={likes} />
      </CardFooter>
    </Card>
  )
} 