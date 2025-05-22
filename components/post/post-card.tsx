"use client"

import { useState } from "react"
import Link from "next/link"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Heart, MessageSquare, Share2, Send, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import type { Post, PostComment } from "@/types/post"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getMediaUrl, deletePost, toggleLikePost, getPostLikes } from "@/lib/api/post"
import { Avatar } from "@/components/shared/avatar"
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

interface PostCardProps {
  post: Post
  onDelete?: (id: string) => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes)
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes.length)
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [mediaIndex, setMediaIndex] = useState(0)
  const mediaCount = post.media.length
  const [showLikesModal, setShowLikesModal] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated || !user?.username) {
      toast({
        title: "Authentication required",
        description: "Please log in to like this post",
      })
      return
    }
    try {
      // Optimistic update
      setIsLiked((prev) => !prev)
      setLikesCount((prev) => prev + (isLiked ? -1 : 1))
      setLikes((prev) =>
        isLiked ? prev.filter((u) => u !== user.username) : [...prev, user.username]
      )
      const result = await toggleLikePost(post.id, user.username)
      setLikes(result.likes)
      setLikesCount(result.likesCount)
      setIsLiked(result.liked)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like/unlike post.",
        variant: "destructive",
      })
    }
  }

  const handleShowLikes = async () => {
    try {
      setShowLikesModal(true)
      // Optionally, fetch latest likes
      const result = await getPostLikes(post.id)
      setLikes(result.likes)
      setLikesCount(result.likesCount)
    } catch {}
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

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id)
      if (onDelete) {
        onDelete(post.id)
      }
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isAuthor = user?.id === post.author.id
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMediaIndex((prev) => (prev === 0 ? mediaCount - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMediaIndex((prev) => (prev === mediaCount - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="overflow-hidden max-w-[400px] mx-auto my-4 p-3 shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              fallback={post.author.name.substring(0, 2)}
            />
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

        {/* Media Carousel */}
        {mediaCount > 0 && (
          <div className="relative w-full max-w-[360px] mx-auto aspect-[4/5] overflow-hidden rounded-[12px] flex items-center justify-center mt-4">
            <div className="w-full h-full transition-transform duration-300 ease-in-out flex items-center justify-center">
              {post.media[mediaIndex].type === "image" ? (
                <img
                  src={getMediaUrl(post.media[mediaIndex].url)}
                  alt=""
                  className="object-cover w-full h-full"
                />
                  ) : (
                <video
                  src={getMediaUrl(post.media[mediaIndex].url)}
                  controls
                  className="object-cover w-full h-full"
                />
                  )}
                </div>
            {/* Left Arrow */}
            {mediaCount > 1 && (
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
            {/* Right Arrow */}
            {mediaCount > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            )}
            {/* Indicator Dots */}
            {mediaCount > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {post.media.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 w-2 rounded-full ${idx === mediaIndex ? "bg-orange-500" : "bg-gray-300"}`}
                  />
              ))}
            </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className={`gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike} aria-label="Like">
              <Heart className={`h-5 w-5 transition-transform duration-200 ${isLiked ? "fill-current scale-125" : "scale-100"}`} />
            </Button>
            <span className="cursor-pointer text-sm" onClick={handleShowLikes}>
              {likes.length === 0 ? "Be the first to like this" :
                likes.length === 1 ? `Liked by ${likes[0]}` :
                `Liked by ${likes[0]} and ${likes.length - 1} other${likes.length > 2 ? 's' : ''}`}
            </span>
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

        {/* Likes Modal */}
        <LikesModal open={showLikesModal} onClose={() => setShowLikesModal(false)} likes={likes} />

        {showComments && (
          <div className="border-t p-4 space-y-4">
            <div className="flex space-x-4">
              <Avatar
                src={user?.avatar}
                alt={user?.name || "User"}
                className="h-8 w-8"
                fallback={user?.name?.substring(0, 2)}
              />
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
                  <Avatar
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-8 w-8"
                    fallback={comment.author.name.substring(0, 2)}
                  />
                  <div className="flex-1">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <Link href={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                          {comment.author.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
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
