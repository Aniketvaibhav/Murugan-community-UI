"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Heart, MessageSquare, Share2, Trash2, ThumbsUp, Send } from "lucide-react"
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
import { getApiUrl } from "@/config"
import { deleteBlog, toggleLikeBlog, getBlogLikes, getBlogComments, addBlogComment, deleteBlogComment } from "@/lib/api/blog"

type BlogMedia = {
  id: string
  type: "image" | "video"
  url: string
}

type BlogComment = {
  id: string
  author: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  content: string
  date: string
}

type BlogDetailProps = {
  id: string
  title: string
  content: string
  category: string
  date: string
  author: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  media: BlogMedia[]
  likes: number
  comments: BlogComment[]
  isLiked?: boolean
}

const API_BASE_URL = getApiUrl()

export function BlogDetail({
  id,
  title,
  content,
  category,
  date,
  author,
  media,
  likes: initialLikes,
  comments: initialComments,
  isLiked: initialIsLiked = false,
}: BlogDetailProps) {
  const [likes, setLikes] = useState<string[]>(Array.isArray(initialLikes) ? initialLikes : [])
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [likeUsers, setLikeUsers] = useState<{ id: string; username: string }[]>([])

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

  useEffect(() => {
    async function fetchComments() {
      try {
        const comments = await getBlogComments(id)
        setComments(comments)
      } catch {
        setComments([])
      }
    }
    fetchComments()
  }, [id])

  const handleLike = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this blog",
      })
      return
    }
    try {
      const result = await toggleLikeBlog(id, user.id)
      setLikes(result.likes)
      setIsLiked(result.liked)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like/unlike blog.",
        variant: "destructive",
      })
    }
  }

  const handleCommentSubmit = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on this blog",
      })
      return
    }
    if (!newComment.trim()) return
    setIsSubmittingComment(true)
    try {
      const token = localStorage.getItem('token') || ''
      const comment = await addBlogComment(id, newComment, token)
      setComments([comment, ...comments])
      setNewComment("")
    } catch {
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteBlog = async () => {
    setIsDeleting(true)
    try {
      await deleteBlog(id)
      toast({
        title: "Blog deleted",
        description: "Your blog has been successfully deleted",
      })
      router.push("/blogs")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the blog. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const isAuthor = user?.id === author.id

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={
                  author.avatar?.startsWith('/uploads')
                    ? `${API_BASE_URL}${author.avatar}`
                    : author.avatar || '/placeholder.svg'
                }
                alt={author.name}
              />
              <AvatarFallback>{author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
          {isAuthor && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your blog and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteBlog}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{category}</span>
          <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        </div>

        <div className="whitespace-pre-line">{content}</div>

        {media.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shared Photos & Videos</h2>
            {media.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg">
                {item.type === "image" ? (
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={
                        item.url?.startsWith('/uploads')
                          ? `${API_BASE_URL}${item.url}`
                          : item.url || "/placeholder.svg"
                      }
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <video src={item.url} controls className="h-auto w-full rounded-lg" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-b py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className={`gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike} disabled={loading}>
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <span className="cursor-pointer text-sm">
              {likeUsers.length === 0
                ? "Be the first to like this"
                : likeUsers.length === 1
                  ? `Liked by ${likeUsers[0].username}`
                  : `Liked by ${likeUsers[0].username} and ${likeUsers.length - 1} other${likeUsers.length > 2 ? 's' : ''}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => document.getElementById("comment-section")?.focus()}
            >
              <MessageSquare className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments ({comments.length})</h2>

        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage
              src={
                user?.avatar?.startsWith('/uploads')
                  ? `${API_BASE_URL}${user.avatar}`
                  : user?.avatar || '/placeholder.svg?height=40&width=40'
              }
              alt={user?.name || "User"}
            />
            <AvatarFallback>{user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              id="comment-section"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                size="sm"
                className="gap-1"
              >
                <Send className="h-4 w-4" />
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          comment.author.avatar?.startsWith('/uploads')
                            ? `${API_BASE_URL}${comment.author.avatar}`
                            : comment.author.avatar || '/placeholder.svg'
                        }
                        alt={comment.author.name}
                      />
                      <AvatarFallback>{comment.author.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.date}</p>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 px-4 py-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    Like
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No comments yet</h3>
              <p className="text-muted-foreground">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
