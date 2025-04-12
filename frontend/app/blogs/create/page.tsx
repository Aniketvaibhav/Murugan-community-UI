import { BlogEditor } from "@/components/blog/blog-editor"

export default function CreateBlogPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create New Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Share your experiences, stories, photos, and videos with the community.
          </p>
        </div>
        <BlogEditor />
      </div>
    </div>
  )
}
