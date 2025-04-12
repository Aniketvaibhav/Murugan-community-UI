"use client"

import type React from "react"

import { ImagesSlider } from "@/components/ui/aceternity/image-slider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useAuthRedirect } from "@/utils/auth-redirect"

// Temple and nature images related to Lord Murugan
const images = [
  "/serene-murugan-hills.png",
  "/palani-temple-dawn.png",
  "/thiruchendur-ocean-vista.png",
  "/swamimalai-evening-glow.png",
  "/pazhamudircholai-forest.png",
]

export function HeroSlider() {
  const { isAuthenticated } = useAuth()
  const { redirectToLogin } = useAuthRedirect()

  const handleJoinNow = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      redirectToLogin("community")
    }
  }

  return (
    <ImagesSlider images={images} autoplayInterval={6000} className="h-[calc(100vh-5rem)] w-full" direction="right">
      <div className="flex flex-col items-center justify-center text-center text-white max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
          Connect with Lord Murugan's <span className="text-primary">Divine Presence</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Join our spiritual community dedicated to Lord Murugan. Share experiences, connect with devotees, and deepen
          your spiritual journey.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={handleJoinNow} asChild>
            <Link href={isAuthenticated ? "/posts" : "/register"}>Join Now →</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white/10"
            asChild
          >
            <Link href="/learn">Explore Temples</Link>
          </Button>
        </div>
      </div>
    </ImagesSlider>
  )
}
