import { PostFeed } from "@/components/post/post-feed"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { ClientOnly } from "@/components/client-only"

export default function PostsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Posts</h1>
            <p className="mt-2 text-muted-foreground">Explore posts from the Lord Murugan community</p>
          </div>
          <Button asChild>
            <Link href="/posts/create" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>

        <ClientOnly>
          <PostFeed />
        </ClientOnly>
      </div>
    </div>
  )
}

