import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Users, Calendar, Plus } from "lucide-react"

// Mock data for voice rooms
const voiceRooms = [
  {
    id: 1,
    title: "Morning Prayer Session",
    description: "Join us for daily morning prayers and mantras dedicated to Lord Murugan.",
    participants: 12,
    host: {
      name: "Lakshmi Devi",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LD",
    },
    isLive: true,
    category: "Prayer",
  },
  {
    id: 2,
    title: "Discussion: Skanda Purana",
    description: "Weekly discussion on chapters from the Skanda Purana, exploring the stories of Lord Murugan.",
    participants: 8,
    host: {
      name: "Ganesh Iyer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "GI",
    },
    isLive: true,
    category: "Discussion",
  },
  {
    id: 3,
    title: "Bhajan Session",
    description: "Join our community bhajan session with devotional songs dedicated to Lord Murugan.",
    participants: 0,
    host: {
      name: "Saraswati Rao",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
    },
    isLive: false,
    scheduledTime: "Today, 7:00 PM",
    category: "Music",
  },
  {
    id: 4,
    title: "Tamil Devotional Poetry Reading",
    description: "Reading and discussing Tamil devotional poetry dedicated to Lord Murugan.",
    participants: 0,
    host: {
      name: "Karthik Raja",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "KR",
    },
    isLive: false,
    scheduledTime: "Tomorrow, 6:00 PM",
    category: "Literature",
  },
  {
    id: 5,
    title: "Meditation Session",
    description: "Guided meditation session focusing on Lord Murugan's qualities and attributes.",
    participants: 0,
    host: {
      name: "Anand Venkat",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AV",
    },
    isLive: false,
    scheduledTime: "Tomorrow, 6:00 AM",
    category: "Meditation",
  },
  {
    id: 6,
    title: "Temple Architecture Discussion",
    description: "Discussion on the architectural features of famous Lord Murugan temples.",
    participants: 0,
    host: {
      name: "Priya Sundaram",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PS",
    },
    isLive: false,
    scheduledTime: "Saturday, 5:00 PM",
    category: "Discussion",
  },
]

// Categories for filtering
const categories = ["All", "Prayer", "Discussion", "Music", "Literature", "Meditation"]

export default function VoiceRoomsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Voice Rooms</h1>
          <p className="text-muted-foreground">
            Join live voice chat rooms to connect with fellow devotees for prayers, discussions, and more.
          </p>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search voice rooms..." className="w-full sm:w-[300px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/voice-rooms/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Link>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {voiceRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {room.category}
                          </span>
                          {room.isLive && (
                            <Badge variant="destructive" className="bg-red-500">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-3 text-xl font-medium">{room.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{room.description}</p>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          {room.isLive ? (
                            <>
                              <Users className="mr-1 h-4 w-4" />
                              <span>{room.participants} participants</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{room.scheduledTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Avatar>
                        <AvatarImage src={room.host.avatar} alt={room.host.name} />
                        <AvatarFallback>{room.host.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/20 p-4">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm">
                        Hosted by <span className="font-medium">{room.host.name}</span>
                      </div>
                      <Button size="sm" className="gap-1">
                        <Mic className="h-4 w-4" />
                        {room.isLive ? "Join Room" : "Set Reminder"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          {categories.slice(1).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {voiceRooms
                  .filter((room) => room.category === category)
                  .map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {room.category}
                              </span>
                              {room.isLive && (
                                <Badge variant="destructive" className="bg-red-500">
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            <h3 className="mt-3 text-xl font-medium">{room.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{room.description}</p>
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                              {room.isLive ? (
                                <>
                                  <Users className="mr-1 h-4 w-4" />
                                  <span>{room.participants} participants</span>
                                </>
                              ) : (
                                <>
                                  <Calendar className="mr-1 h-4 w-4" />
                                  <span>{room.scheduledTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Avatar>
                            <AvatarImage src={room.host.avatar} alt={room.host.name} />
                            <AvatarFallback>{room.host.initials}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/20 p-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="text-sm">
                            Hosted by <span className="font-medium">{room.host.name}</span>
                          </div>
                          <Button size="sm" className="gap-1">
                            <Mic className="h-4 w-4" />
                            {room.isLive ? "Join Room" : "Set Reminder"}
                          </Button>
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
