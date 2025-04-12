"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/utils/auth-redirect"

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Thaipusam Celebration",
    date: "January 25, 2024",
    time: "6:00 AM - 9:00 PM",
    location: "Sri Subramaniar Temple, Kuala Lumpur",
    type: "Festival",
  },
  {
    id: 2,
    title: "Skanda Sashti Vratham",
    date: "November 8, 2023",
    time: "5:00 AM - 8:00 PM",
    location: "Arulmigu Murugan Temple, Chennai",
    type: "Religious Observance",
  },
  {
    id: 3,
    title: "Vaikasi Visakam",
    date: "June 12, 2024",
    time: "6:00 AM - 8:00 PM",
    location: "Palani Murugan Temple, Tamil Nadu",
    type: "Festival",
  },
]

export function UpcomingEvents() {
  const { isAuthenticated } = useAuth()
  const { redirectToLogin } = useAuthRedirect()

  const handleEventAction = (e: React.MouseEvent, actionType: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      redirectToLogin(`event ${actionType.toLowerCase()}`)
    }
    // If authenticated, the Link will handle navigation for details
    // or the action would be performed for "Add to Calendar"
  }

  return (
    <div className="mt-6 space-y-4">
      {upcomingEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {event.type}
                </span>
                <h3 className="text-lg font-medium">{event.title}</h3>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>
                    {event.date} • {event.time}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 p-4">
            <div className="flex w-full items-center justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={(e) => handleEventAction(e, "Details")} asChild>
                <Link href={`/events/${event.id}`}>Details</Link>
              </Button>
              <Button size="sm" onClick={(e) => handleEventAction(e, "Calendar")}>
                Add to Calendar
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
