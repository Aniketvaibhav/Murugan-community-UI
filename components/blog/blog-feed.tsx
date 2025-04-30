"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Blog } from "@/types/blog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search } from "lucide-react"
import { getBlogs, deleteBlog, getCategories } from "@/lib/api/blog"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"

interface BlogFeedProps {
  userOnly?: boolean
  username?: string
}

export function BlogFeed({ userOnly = false, username }: BlogFeedProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const debouncedSearch = useDebounce(searchQuery, 500)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.data.categories)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await getBlogs(page, 10, selectedCategory, debouncedSearch)
      const newBlogs = response.data.blogs

      if (userOnly && username) {
        const filteredBlogs = newBlogs.filter((blog) => blog.author.username === username)
        setBlogs(filteredBlogs)
      } else {
        if (activeTab === "popular") {
          newBlogs.sort((a, b) => b.likes - a.likes)
        } else {
          newBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        setBlogs(newBlogs)
      }

      setHasMore(response.data.pagination.page < response.data.pagination.pages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setPage(1)
    fetchBlogs()
  }, [selectedCategory, debouncedSearch, userOnly, username, activeTab])

  useEffect(() => {
    if (page > 1) {
      fetchBlogs()
    }
  }, [page])

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      toast({
        title: "Blog deleted",
        description: "Your blog has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadMore = () => {
    setPage(page + 1)
  }

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">No blogs found</h3>
        <p className="text-muted-foreground">
          {userOnly ? "You haven't created any blogs yet." : "There are no blogs to display."}
        </p>
        {userOnly && (
          <Button className="mt-4" asChild>
            <a href="/blogs/create">Create Your First Blog</a>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!userOnly && (
        <Tabs defaultValue="recent" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onDelete={handleDeleteBlog} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  )
} 