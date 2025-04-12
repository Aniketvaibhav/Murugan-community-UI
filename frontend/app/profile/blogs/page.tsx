import { UserBlogs } from "@/components/blog/user-blogs"

export default function UserBlogsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Manage Your Blogs</h1>
        <UserBlogs />
      </div>
    </div>
  )
}
