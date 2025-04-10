"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Icons } from "@/components/icons"
import { Image, Video, X } from "lucide-react"

type MediaItem = {
  id: string
  type: "image" | "video"
  url: string
  file?: File
  previewUrl: string
}

export function BlogEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [category, setCategory] = useState("")
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

    const newMediaItems: MediaItem[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const previewUrl = URL.createObjectURL(file)

      newMediaItems.push({
        id: `media-${Date.now()}-${i}`,
        type,
        url: "",
        file,
        previewUrl,
      })
    }

    setMediaItems([...mediaItems, ...newMediaItems])
    e.target.value = ""
  }

  const removeMedia = (id: string) => {
    const updatedMedia = mediaItems.filter((item) => item.id !== id)
    setMediaItems(updatedMedia)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to publish a blog",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !content.trim() || !category.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would upload media files to a storage service
      // and then save the blog post with media URLs to a database

      // Mock successful blog creation
      setTimeout(() => {
        toast({
          title: "Blog published!",
          description: "Your blog has been successfully published.",
        })
        setIsSubmitting(false)
        router.push("/blogs")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish blog. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="E.g., Pilgrimage, Temples, Festivals, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Share Photos & Videos</Label>
        <div className="flex space-x-4">
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
        <div className="mt-2 text-xs text-muted-foreground">
          <p>
            Share your temple visits, festival celebrations, and spiritual experiences with the community through photos
            and videos.
          </p>
        </div>
      </div>

      {mediaItems.length > 0 && (
        <div className="space-y-2">
          <Label>Media Preview</Label>
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
                      src={item.previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="aspect-square h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <video src={item.previewUrl} controls className="aspect-video h-full w-full rounded-md" />
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
          Publish Blog
        </Button>
      </div>
    </form>
  )
}

