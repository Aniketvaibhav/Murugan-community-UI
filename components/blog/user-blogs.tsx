"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Edit, Trash2, Eye, Heart, MessageSquare } from "lucide-react"
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

type UserBlog = {
  id: string
  title: string
  excerpt: string
  date: string
  likes: number
  comments: number
  status: "published" | "draft"
}

// Mock user blogs - in a real app, this would come from an API
const mockUserBlogs: UserBlog[] = [
  {
    id: "1",
    title: "My Pilgrimage to Palani Temple",
    excerpt: "Sharing my spiritual journey to one of the six abodes of Lord Murugan...",
    date: "May 15, 2023",
    likes: 42,
    comments: 12,
    status: "published",
  },
  {
    id: "2",
    title: "The Divine Experience at Thiruchendur",
    excerpt: "My visit to the coastal temple of Lord Murugan and the spiritual awakening I experienced...",
    date: "June 28, 2023",
    likes: 38,
    comments: 9,
    status: "published",
  },
  {
    id: "3",
    title: "Understanding the Six Faces of Lord Murugan",
    excerpt: "A draft exploring the spiritual significance of Shanmukha...",
    date: "July 10, 2023",
    likes: 0,
    comments: 0,
    status: "draft",
  },
]

export function UserBlogs() {
  const [userBlogs, setUserBlogs] = useState<UserBlog[]>(mockUserBlogs)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const handleDeleteBlog = (id: string) => {
    // In a real app, this would call an API to delete the blog
    const updatedBlogs = userBlogs.filter((blog) => blog.id !== id)
    setUserBlogs(updatedBlogs)

    toast({
      title: "Blog deleted",
      description: "Your blog has been successfully deleted",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">Authentication Required</h3>
        <p className="text-muted-foreground">Please log in to manage your blogs</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Blogs</h2>
        <Button asChild>
          <Link href="/blogs/create">Create New Blog</Link>
        </Button>
      </div>

      {userBlogs.length > 0 ? (
        <div className="space-y-4">
          {userBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{blog.title}</h3>
                      {blog.status === "draft" && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">Draft</span>
                      )}
                    </div>
                    <p className="mt-2 text-muted-foreground">{blog.excerpt}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{blog.date}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Heart className="mr-1 h-4 w-4" />
                      {blog.likes} likes
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {blog.comments} comments
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/blogs/${blog.id}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/blogs/edit/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
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
                            This action cannot be undone. This will permanently delete your blog and remove it from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No blogs yet</h3>
          <p className="text-muted-foreground">Start creating your first blog post</p>
          <Button className="mt-4" asChild>
            <Link href="/blogs/create">Create Blog</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
