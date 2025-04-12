"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      toast({
        title: "Authentication Error",
        description:
          error === "google_auth_failed"
            ? "Failed to authenticate with Google. Please try again."
            : "An error occurred during authentication.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // In a real app, this would call an API to authenticate the user
    setTimeout(() => {
      setIsLoading(false)

      // Mock user data - in a real app, this would come from the API
      const userData = {
        id: "1",
        name: "Ramesh Kumar",
        username: "rameshk",
        avatar: "/placeholder.svg?height=128&width=128",
      }

      // Login the user
      login(userData)

      toast({
        title: "Login successful!",
        description: "Welcome back to the Lord Murugan Community.",
      })

      router.push("/")
    }, 2000)
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading} onClick={() => router.push("/api/auth/google")}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <Icons.facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  )
}
