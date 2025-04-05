"use client"

import { PostCreator } from "@/components/post/post-creator"

export default function CreatePostPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create Post</h1>
          <p className="mt-2 text-muted-foreground">Share your experiences, photos, and videos with the community</p>
        </div>
        <PostCreator />
      </div>
    </div>
  )
}

