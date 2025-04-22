"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeaturedBlogs } from "@/components/featured-blogs"
import { ActiveVoiceRooms } from "@/components/active-voice-rooms"
import { UpcomingEvents } from "@/components/upcoming-events"
import { useAuth } from "@/contexts/auth-context"
import { PostFeed } from "@/components/post/post-feed"
import { useAuthRedirect } from "@/utils/auth-redirect"
import { HeroSlider } from "@/components/hero-slider"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const { redirectToLogin } = useAuthRedirect()

  const handleViewAllClick = (e: React.MouseEvent, section: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      redirectToLogin(section)
    }
    // If authenticated, the Link will handle navigation
  }

  // If user is authenticated, show the feed
  if (isAuthenticated) {
    return (
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="mb-6 text-3xl font-bold">Your Feed</h1>
            <PostFeed />
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Voice Rooms</h2>
                <Button variant="link" asChild>
                  <Link href="/voice-rooms">View All</Link>
                </Button>
              </div>
              <ActiveVoiceRooms />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upcoming Events</h2>
                <Button variant="link" asChild>
                  <Link href="/events">View All</Link>
                </Button>
              </div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show the landing page
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <HeroSlider />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Connect, Share, and Grow</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-saffron-200 bg-gradient-to-br from-saffron-50 to-background">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium">Share Your Stories</h3>
                <p className="mt-2 text-muted-foreground">
                  Write blogs about your spiritual experiences, temple visits, and personal insights.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-peacock-200 bg-gradient-to-br from-peacock-50 to-background">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-peacock-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-secondary"
                  >
                    <path d="M15 6h.01" />
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M4 22h16" />
                    <path d="M2 17h20" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium">Share Photos & Videos</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload and share images and videos from festivals, rituals, and temple visits through posts.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-lotus-200 bg-gradient-to-br from-lotus-50 to-background">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lotus-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-accent"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium">Join Voice Rooms</h3>
                <p className="mt-2 text-muted-foreground">
                  Participate in group voice chats for prayers, discussions, and spiritual gatherings.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-saffron-200 bg-gradient-to-br from-saffron-50 to-background">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium">Learn & Discover</h3>
                <p className="mt-2 text-muted-foreground">
                  Access resources about Lord Murugan's history, mythology, temples, and festivals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Blogs</h2>
                <Button variant="link" onClick={(e) => handleViewAllClick(e, "blogs")} asChild>
                  <Link href="/blogs">View All</Link>
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">
                Click on a blog to expand and read more. Sign in to access the full articles.
              </p>
              <FeaturedBlogs />
            </div>
          </div>
        </div>
      </section>

      {/* Voice Rooms & Events Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Active Voice Rooms</h2>
                <Button variant="link" onClick={(e) => handleViewAllClick(e, "voice rooms")} asChild>
                  <Link href="/voice-rooms">View All</Link>
                </Button>
              </div>
              <ActiveVoiceRooms />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Upcoming Events</h2>
                <Button variant="link" onClick={(e) => handleViewAllClick(e, "events")} asChild>
                  <Link href="/events">View All</Link>
                </Button>
              </div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-b from-peacock-900 to-peacock-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[url('/patterns/temple-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Growing Community of Devotees
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-peacock-100">
            Connect with thousands of devotees, share your spiritual journey, and deepen your connection with Lord
            Murugan.
          </p>
          <Button size="lg" className="mt-8 bg-white text-peacock-950 hover:bg-peacock-100" asChild>
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
