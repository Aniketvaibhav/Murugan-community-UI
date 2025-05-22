"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
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
import Image from "next/image"
import { getBlogs } from "@/lib/api/blog"
import type { Blog } from "@/types/blog"
import { getApiUrl } from "@/config"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BlogCard } from "@/components/blog/blog-card"

const API_BASE_URL = getApiUrl()

// Categories for filtering
const categories = ["All", "Pilgrimage", "Symbolism", "Festivals", "Mythology", "Temples", "Literature"]

export default function BlogsPage() {
  const { user, isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Initialize showMyBlogs from URL
  const [showMyBlogs, setShowMyBlogs] = useState(() => {
    return searchParams.get('filter') === 'my-blogs'
  })

  // Update URL when filter changes
  const handleFilterToggle = async () => {
    setIsFiltering(true)
    const newState = !showMyBlogs
    setShowMyBlogs(newState)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (newState) {
      params.set('filter', 'my-blogs')
    } else {
      params.delete('filter')
    }
    router.push(`?${params.toString()}`)
    
    // Simulate loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFiltering(false)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const response = await getBlogs()
        setBlogs(
          response.data.blogs.map((blog: any) => ({
            ...blog,
            media: blog.media?.map((m: any) => ({
              ...m,
              url: m.url?.startsWith('http') ? m.url : `${API_BASE_URL}${m.url}`,
            })) || [],
            author: {
              ...blog.author,
              avatar: blog.author.avatar?.startsWith('http')
                ? blog.author.avatar
                : `${API_BASE_URL}${blog.author.avatar}`,
            },
          }))
        )
      } catch (error) {
        // Optionally handle error
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleDeleteBlog = (id: string) => {
    // In a real app, this would call an API to delete the blog
    const updatedBlogs = blogs.filter((blog) => blog.id !== id)
    setBlogs(updatedBlogs)
  }
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blogs</h1>
          <p className="text-muted-foreground">
            Explore devotional experiences, insights, and knowledge shared by our community.
          </p>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search blogs..." className="w-full sm:w-[300px]" />
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleFilterToggle}
                className={`relative ${showMyBlogs ? "bg-primary/10" : ""}`}
                disabled={isFiltering}
              >
                {isFiltering ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  showMyBlogs ? "Show All Blogs" : "My Blogs"
                )}
              </Button>
            )}
            <Button asChild>
              <Link href="/blogs/create">Create Blog</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="rounded-full">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="All" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={showMyBlogs ? 'my-blogs' : 'all-blogs'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {blogs
                  .filter((blog) => !showMyBlogs || (user && blog.author.username === user.username))
                  .map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      {...(user && blog.author.username === user.username ? { onDelete: handleDeleteBlog } : {})}
                    />
                  ))}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          {categories.slice(1).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${category}-${showMyBlogs ? 'my-blogs' : 'all-blogs'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {blogs
                    .filter((blog) => blog.category === category)
                    .filter((blog) => !showMyBlogs || (user && blog.author.username === user.username))
                    .map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        {...(user && blog.author.username === user.username ? { onDelete: handleDeleteBlog } : {})}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
