"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Icons } from "@/components/icons"
import { Image, Video, X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { PostMedia } from "@/types/post"

export function PostCreator() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaItems, setMediaItems] = useState<PostMedia[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleVideoClick = () => {
    videoInputRef.current?.click()
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newMediaItems: PostMedia[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const previewUrl = URL.createObjectURL(file)

      newMediaItems.push({
        id: `media-${Date.now()}-${i}`,
        type,
        url: previewUrl,
      })
    }

    setMediaItems([...mediaItems, ...newMediaItems])
    e.target.value = ""
  }

  const removeMedia = (id: string) => {
    const updatedMedia = mediaItems.filter((item) => item.id !== id)
    setMediaItems(updatedMedia)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      })
      return
    }

    if (!content.trim() && mediaItems.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would upload media files to a storage service
      // and then save the post with media URLs to a database

      // Mock successful post creation
      setTimeout(() => {
        toast({
          title: "Post created!",
          description: "Your post has been successfully published.",
        })
        setIsSubmitting(false)
        router.push("/posts")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-primary/20 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Add tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="pl-9"
            />
          </div>
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleImageClick} className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Add Images
          </Button>
          <Button type="button" variant="outline" onClick={handleVideoClick} className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Add Videos
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMediaUpload(e, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => handleMediaUpload(e, "video")}
          />
        </div>
      </div>

      {mediaItems.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {mediaItems.map((item) => (
              <Card key={item.id} className="relative overflow-hidden">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 rounded-full"
                  onClick={() => removeMedia(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-2">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt="Preview"
                      className="aspect-square h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <video src={item.url} controls className="aspect-video h-full w-full rounded-md" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Publish Post
        </Button>
      </div>
    </form>
  )
}
