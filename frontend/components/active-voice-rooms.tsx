"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/utils/auth-redirect"

// Mock data for active voice rooms
const activeRooms = [
  {
    id: 1,
    title: "Morning Prayer Session",
    participants: 12,
    host: {
      name: "Lakshmi Devi",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LD",
    },
    isLive: true,
  },
  {
    id: 2,
    title: "Discussion: Skanda Purana",
    participants: 8,
    host: {
      name: "Ganesh Iyer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "GI",
    },
    isLive: true,
  },
  {
    id: 3,
    title: "Bhajan Session",
    participants: 15,
    host: {
      name: "Saraswati Rao",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
    },
    isLive: false,
    scheduledTime: "Starts in 30 minutes",
  },
]

export function ActiveVoiceRooms() {
  const { isAuthenticated } = useAuth()
  const { redirectToLogin } = useAuthRedirect()

  const handleRoomAction = (roomTitle: string) => {
    if (!isAuthenticated) {
      redirectToLogin("voice rooms")
      return
    }
    // If authenticated, this would normally navigate to the room
  }

  return (
    <div className="mt-6 space-y-4">
      {activeRooms.map((room) => (
        <Card key={room.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium">{room.title}</h3>
                  {room.isLive && (
                    <Badge variant="destructive" className="bg-red-500">
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{room.participants} participants</span>
                  {!room.isLive && <span className="ml-4 text-sm text-muted-foreground">{room.scheduledTime}</span>}
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
              <Button size="sm" className="gap-1" onClick={() => handleRoomAction(room.title)}>
                <Mic className="h-4 w-4" />
                {room.isLive ? "Join Room" : "Set Reminder"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

