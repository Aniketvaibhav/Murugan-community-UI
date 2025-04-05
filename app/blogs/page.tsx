import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
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

// Mock data for blogs
const initialBlogs = [
  {
    id: 1,
    title: "My Pilgrimage to Palani Temple",
    excerpt: "Sharing my spiritual journey to one of the six abodes of Lord Murugan...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "1",
      name: "Ramesh Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RK",
    },
    date: "May 15, 2023",
    readTime: "5 min read",
    category: "Pilgrimage",
    likes: 42,
    comments: 12,
  },
  {
    id: 2,
    title: "The Significance of Vel in Murugan Worship",
    excerpt: "Exploring the symbolism and spiritual meaning behind Lord Murugan's spear...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "2",
      name: "Priya Sundaram",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PS",
    },
    date: "April 28, 2023",
    readTime: "7 min read",
    category: "Symbolism",
    likes: 38,
    comments: 8,
  },
  {
    id: 3,
    title: "Celebrating Thaipusam: A Personal Account",
    excerpt: "My experience participating in the Thaipusam festival for the first time...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "3",
      name: "Anand Venkat",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AV",
    },
    date: "February 10, 2023",
    readTime: "6 min read",
    category: "Festivals",
    likes: 56,
    comments: 15,
  },
  {
    id: 4,
    title: "Understanding the Six Faces of Lord Murugan",
    excerpt: "Delving into the spiritual significance of Shanmukha, the six-faced deity...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "4",
      name: "Lakshmi Narayanan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LN",
    },
    date: "March 5, 2023",
    readTime: "8 min read",
    category: "Mythology",
    likes: 62,
    comments: 20,
  },
  {
    id: 5,
    title: "The Sacred Groves of Murugan Temples",
    excerpt: "Exploring the ecological and spiritual significance of sacred groves in Murugan temples...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "5",
      name: "Karthik Raja",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "KR",
    },
    date: "June 12, 2023",
    readTime: "6 min read",
    category: "Temples",
    likes: 35,
    comments: 9,
  },
  {
    id: 6,
    title: "Murugan in Tamil Literature: A Journey Through Sangam Poetry",
    excerpt: "Analyzing the references to Lord Murugan in ancient Tamil Sangam literature...",
    image: "/placeholder.svg?height=200&width=400",
    author: {
      id: "6",
      name: "Meenakshi Sundaram",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MS",
    },
    date: "July 8, 2023",
    readTime: "10 min read",
    category: "Literature",
    likes: 48,
    comments: 14,
  },
]

// Categories for filtering
const categories = ["All", "Pilgrimage", "Symbolism", "Festivals", "Mythology", "Temples", "Literature"]
;("use client")

export default function BlogsPage() {
  const { user, isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState(initialBlogs)
  const [showMyBlogs, setShowMyBlogs] = useState(false)

  const handleDeleteBlog = (id: number) => {
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
                onClick={() => setShowMyBlogs(!showMyBlogs)}
                className={showMyBlogs ? "bg-primary/10" : ""}
              >
                {showMyBlogs ? "Show All Blogs" : "My Blogs"}
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs
                .filter((blog) => !showMyBlogs || (user && blog.author.id === user.id))
                .map((blog) => (
                  <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-md">
                    <Link href={`/blogs/${blog.id}`}>
                      <CardContent className="p-0 relative">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {blog.category}
                              </span>
                            </div>

                            {isAuthenticated && user?.id === blog.author.id && (
                              <div className="absolute right-4 top-4 z-10">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => e.preventDefault()}
                                      className="bg-background/80 backdrop-blur-sm"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Options</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/blogs/edit/${blog.id}`}
                                        className="flex items-center cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your blog.
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
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>

                          <h3 className="mt-3 text-xl font-semibold">{blog.title}</h3>
                          <p className="mt-2 text-muted-foreground">{blog.excerpt}</p>
                        </div>
                      </CardContent>
                    </Link>
                    <CardFooter className="border-t bg-muted/20 p-4">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                            <AvatarFallback>{blog.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{blog.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {blog.date} · {blog.readTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{blog.likes} likes</span>
                          <span className="mx-2">•</span>
                          <span>{blog.comments} comments</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          {categories.slice(1).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs
                  .filter((blog) => blog.category === category)
                  .filter((blog) => !showMyBlogs || (user && blog.author.id === user.id))
                  .map((blog) => (
                    <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-md">
                      <Link href={`/blogs/${blog.id}`}>
                        <CardContent className="p-0 relative">
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={blog.image || "/placeholder.svg"}
                              alt={blog.title}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                  {blog.category}
                                </span>
                              </div>

                              {isAuthenticated && user?.id === blog.author.id && (
                                <div className="absolute right-4 top-4 z-10">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => e.preventDefault()}
                                        className="bg-background/80 backdrop-blur-sm"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Options</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem asChild>
                                        <Link
                                          href={`/blogs/edit/${blog.id}`}
                                          className="flex items-center cursor-pointer"
                                        >
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit
                                        </Link>
                                      </DropdownMenuItem>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="text-destructive focus:text-destructive"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This will permanently delete your blog.
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
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>

                            <h3 className="mt-3 text-xl font-semibold">{blog.title}</h3>
                            <p className="mt-2 text-muted-foreground">{blog.excerpt}</p>
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="border-t bg-muted/20 p-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                              <AvatarFallback>{blog.author.initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{blog.author.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {blog.date} · {blog.readTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{blog.likes} likes</span>
                            <span className="mx-2">•</span>
                            <span>{blog.comments} comments</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

