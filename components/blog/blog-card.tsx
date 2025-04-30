"use client"

import { useState } from "react"
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

interface BlogCardProps {
  blog: Blog
  onDelete?: (id: string) => void
}

export function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [likes, setLikes] = useState(blog.likes)
  const [isLiked, setIsLiked] = useState(blog.isLiked || false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this blog",
      })
      return
    }

    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
    }
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
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
        <div className="p-6">
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
                  <DropdownMenuItem asChild>
                    <Link href={`/blogs/edit/${blog.id}`} className="cursor-pointer">
                      Edit Blog
                    </Link>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        Delete Blog
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your blog.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteBlog}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Link href={`/blogs/${blog.id}`}>
            <h2 className="mt-4 text-xl font-semibold hover:underline">{blog.title}</h2>
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
          <Button variant="ghost" size="sm" className={`gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike}>
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-5 w-5" />
            <span>{blog.comments.length}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
} 