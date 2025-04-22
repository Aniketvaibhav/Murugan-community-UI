"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GoogleCallbackPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const processAuth = async () => {
      try {
        const userDataParam = searchParams.get("userData")

        if (!userDataParam) {
          setError("No user data provided")
          setIsProcessing(false)
          return
        }

        const userData = JSON.parse(decodeURIComponent(userDataParam))

        // Login the user using the auth context
        login(userData)

        toast({
          title: "Login successful!",
          description: "Welcome to the Lord Murugan Community.",
        })

        // Redirect to home page
        router.push("/")
      } catch (error) {
        console.error("Error processing Google authentication:", error)
        setError("Failed to process authentication")

        toast({
          title: "Authentication failed",
          description: "There was an error logging in with Google. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }

    processAuth()
  }, [login, router, searchParams, toast])

  // If there's an error, show it
  if (error) {
    return (
      <div className="container flex h-screen flex-col items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {error}.{" "}
            <a href="/login" className="underline">
              Return to login
            </a>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show loading state
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-xl font-semibold">Completing your sign in...</h1>
        <p className="mt-2 text-muted-foreground">Please wait while we set up your session.</p>
      </div>
    </div>
  )
}
