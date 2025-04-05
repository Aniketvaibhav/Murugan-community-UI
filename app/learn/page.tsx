import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, MapPin, Calendar } from "lucide-react"

// Mock data for learning resources
const categories = [
  {
    id: "mythology",
    title: "Mythology",
    description: "Learn about the stories, legends, and mythology of Lord Murugan",
    icon: BookOpen,
  },
  {
    id: "temples",
    title: "Temples",
    description: "Explore the sacred temples dedicated to Lord Murugan",
    icon: MapPin,
  },
  {
    id: "festivals",
    title: "Festivals",
    description: "Discover the festivals and celebrations honoring Lord Murugan",
    icon: Calendar,
  },
  {
    id: "practices",
    title: "Practices",
    description: "Learn about devotional practices, rituals, and prayers",
    icon: Clock,
  },
]

const mythologyResources = [
  {
    id: 1,
    title: "The Birth of Lord Murugan",
    description: "Learn about the divine birth of Lord Murugan from Lord Shiva's third eye.",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "10 min read",
  },
  {
    id: 2,
    title: "Murugan and the Six Faces",
    description: "Discover the story behind Lord Murugan's six faces and their significance.",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "The Divine Spear: Vel",
    description: "Explore the mythology and symbolism of Lord Murugan's divine weapon, the Vel.",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "8 min read",
  },
  {
    id: 4,
    title: "Murugan and Valli",
    description: "The divine love story of Lord Murugan and Valli, his tribal consort.",
    image: "/placeholder.svg?height=200&width=300",
    readTime: "15 min read",
  },
]

const templeResources = [
  {
    id: 1,
    title: "Palani Murugan Temple",
    description: "Explore one of the six abodes of Lord Murugan located in Palani, Tamil Nadu.",
    image: "/placeholder.svg?height=200&width=300",
    location: "Palani, Tamil Nadu, India",
  },
  {
    id: 2,
    title: "Tiruchendur Temple",
    description: "Discover the coastal temple dedicated to Lord Murugan in Tiruchendur.",
    image: "/placeholder.svg?height=200&width=300",
    location: "Tiruchendur, Tamil Nadu, India",
  },
  {
    id: 3,
    title: "Swamimalai Temple",
    description: "Learn about the temple where Lord Murugan taught the meaning of Om to Lord Shiva.",
    image: "/placeholder.svg?height=200&width=300",
    location: "Swamimalai, Tamil Nadu, India",
  },
  {
    id: 4,
    title: "Pazhamudircholai Temple",
    description: "Explore the temple located amidst lush green forests on a hill.",
    image: "/placeholder.svg?height=200&width=300",
    location: "Madurai, Tamil Nadu, India",
  },
]

const festivalResources = [
  {
    id: 1,
    title: "Thaipusam Festival",
    description: "Learn about the grand festival celebrating Lord Murugan's victory over evil forces.",
    image: "/placeholder.svg?height=200&width=300",
    date: "January/February (Thai month)",
  },
  {
    id: 2,
    title: "Skanda Sashti",
    description: "Discover the six-day festival commemorating Lord Murugan's victory over demon Surapadman.",
    image: "/placeholder.svg?height=200&width=300",
    date: "October/November",
  },
  {
    id: 3,
    title: "Vaikasi Visakam",
    description: "Explore the festival celebrating Lord Murugan's birthday.",
    image: "/placeholder.svg?height=200&width=300",
    date: "May/June (Vaikasi month)",
  },
  {
    id: 4,
    title: "Panguni Uttiram",
    description: "Learn about the festival celebrating Lord Murugan's marriage to Deivayanai and Valli.",
    image: "/placeholder.svg?height=200&width=300",
    date: "March/April (Panguni month)",
  },
]

const practiceResources = [
  {
    id: 1,
    title: "Murugan Mantras",
    description: "Learn the sacred mantras dedicated to Lord Murugan and their significance.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "Practice guide",
  },
  {
    id: 2,
    title: "Kavadi Ritual",
    description: "Understand the sacred Kavadi ritual performed by devotees of Lord Murugan.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "Ritual guide",
  },
  {
    id: 3,
    title: "Vel Worship",
    description: "Learn about the worship of the Vel, Lord Murugan's divine spear.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "Worship guide",
  },
  {
    id: 4,
    title: "Skanda Sashti Kavacham",
    description: "Explore the powerful prayer that acts as an armor of protection from Lord Murugan.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "Prayer guide",
  },
]

export default function LearnPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Learn About Lord Murugan</h1>
          <p className="text-muted-foreground">
            Explore the rich mythology, sacred temples, festivals, and devotional practices related to Lord Murugan.
          </p>
        </div>

        <Tabs defaultValue="mythology" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4 p-1 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col py-4 px-2 h-auto items-center justify-center"
              >
                <category.icon className="mb-2 h-5 w-5" />
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="mythology" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {mythologyResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {resource.readTime}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/learn/mythology/${resource.id}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="temples" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {templeResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {resource.location}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/learn/temples/${resource.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="festivals" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {festivalResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {resource.date}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/learn/festivals/${resource.id}`}>Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practices" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {practiceResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {resource.duration}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/learn/practices/${resource.id}`}>View Guide</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

