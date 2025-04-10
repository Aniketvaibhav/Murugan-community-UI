"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Heart, MessageSquare, Share2, Send, MoreHorizontal } from "lucide-react"
import type { Post, PostComment } from "@/types/post"
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

interface PostCardProps {
  post: Post
  onDelete?: (id: string) => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this post",
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

  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on this post",
      })
      return
    }

    if (!newComment.trim()) {
      return
    }

    setIsSubmittingComment(true)

    // In a real app, this would send the comment to an API
    setTimeout(() => {
      const newCommentObj: PostComment = {
        id: `comment-${Date.now()}`,
        author: {
          id: user?.id || "guest",
          name: user?.name || "Guest User",
          avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
          username: user?.username || "guest",
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      }

      setComments([...comments, newCommentObj])
      setNewComment("")
      setIsSubmittingComment(false)
    }, 1000)
  }

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(post.id)
    }
  }

  const isAuthor = user?.id === post.author.id
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline">
                {post.author.name}
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
                  <Link href={`/posts/edit/${post.id}`} className="cursor-pointer">
                    Edit Post
                  </Link>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      Delete Post
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePost}
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

        {post.content && <div className="mt-4 whitespace-pre-wrap">{post.content}</div>}

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/posts/tag/${tag.name}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {post.media.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className={`grid gap-2 ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {post.media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg">
                  {item.type === "image" ? (
                    <img src={item.url || "/placeholder.svg"} alt="" className="h-auto w-full object-cover" />
                  ) : (
                    <video src={item.url} controls className="h-auto w-full rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className={`gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike}>
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setShowComments(!showComments)}>
              <MessageSquare className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="border-t p-4 space-y-4">
            <div className="flex space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
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
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link href={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                        {comment.author.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

